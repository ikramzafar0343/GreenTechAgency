#!/usr/bin/env bash
# =============================================================================
# GreenTech Agency — Hostinger VPS production deploy
# Domain : greentechagency.com
# VPS IP : 72.61.19.3
#
# SAFETY: Creates ONLY new paths, ports, DB, nginx site, and PM2 apps.
#         Does NOT edit/delete other sites' nginx configs or PM2 processes.
#
# Usage (as root on the VPS):
#   bash hostinger-greentech.sh inspect   # read-only check first
#   bash hostinger-greentech.sh deploy    # full install + start
#   bash hostinger-greentech.sh ssl       # Let's Encrypt (after DNS points here)
#   bash hostinger-greentech.sh update    # git pull + rebuild + restart
# =============================================================================

set -euo pipefail

DOMAIN="greentechagency.com"
WWW="www.${DOMAIN}"
APP_ROOT="/var/www/greentechagency"
REPO_URL="https://github.com/ikramzafar0343/GreenTechAgency.git"
BRANCH="main"

# Isolated ports — change only if inspect shows a conflict
FE_PORT=3010
BE_PORT=4010

PM2_FE="greentech-frontend"
PM2_BE="greentech-backend"
NGINX_SITE="greentechagency"
DB_NAME="greentech"
DB_USER="greentech"
MEDIA_ROOT="${APP_ROOT}/data/media"

RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GRN}[OK]${NC} $*"; }
warn() { echo -e "${YLW}[!!]${NC} $*"; }
die()  { echo -e "${RED}[ERR]${NC} $*"; exit 1; }

need_root() {
  [[ "$(id -u)" -eq 0 ]] || die "Run as root (Hostinger web console / ssh root@72.61.19.3)"
}

port_free() {
  local p="$1"
  if ss -tlnp 2>/dev/null | grep -qE ":${p}\\b"; then
    return 1
  fi
  return 0
}

cmd_inspect() {
  need_root
  echo "========== READ-ONLY INSPECT (safe) =========="
  echo "Hostname: $(hostname)"
  echo "OS: $(. /etc/os-release && echo "$PRETTY_NAME")"
  echo
  echo "--- Listening ports (look for ${FE_PORT}/${BE_PORT}) ---"
  ss -tlnp | head -n 80 || true
  echo
  echo "--- Existing nginx sites ---"
  ls -la /etc/nginx/sites-enabled 2>/dev/null || ls -la /etc/nginx/conf.d 2>/dev/null || warn "nginx not found yet"
  echo
  echo "--- Existing PM2 processes (will NOT be touched) ---"
  if command -v pm2 >/dev/null 2>&1; then
    pm2 list || true
  else
    warn "pm2 not installed yet"
  fi
  echo
  echo "--- Port conflict check ---"
  if port_free "$FE_PORT"; then log "Frontend port ${FE_PORT} is free"; else warn "Port ${FE_PORT} IN USE — change FE_PORT in this script"; fi
  if port_free "$BE_PORT"; then log "Backend port ${BE_PORT} is free"; else warn "Port ${BE_PORT} IN USE — change BE_PORT in this script"; fi
  echo
  echo "--- DNS tip ---"
  echo "GoDaddy A record @ must be 72.61.19.3 (not the old 132.148.73.92)"
  echo "=============================================="
}

install_base() {
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y curl git nginx certbot python3-certbot-nginx ufw

  if ! command -v node >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
  fi

  if ! command -v pm2 >/dev/null 2>&1; then
    npm install -g pm2
  fi

  if ! command -v psql >/dev/null 2>&1; then
    apt-get install -y postgresql postgresql-contrib
    systemctl enable --now postgresql
  fi

  log "Base packages ready (node=$(node -v), npm=$(npm -v))"
}

setup_db() {
  local pass_file="${APP_ROOT}/.db_password"
  mkdir -p "$APP_ROOT"
  if [[ ! -f "$pass_file" ]]; then
    openssl rand -hex 24 > "$pass_file"
    chmod 600 "$pass_file"
  fi
  local DB_PASS
  DB_PASS="$(cat "$pass_file")"

  # Create role/db only if missing — never drop existing DBs
  sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 \
    || sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"
  sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
    || sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
  sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO ${DB_USER};" || true

  log "Postgres DB '${DB_NAME}' ready (user ${DB_USER})"
}

clone_or_update() {
  if [[ -d "${APP_ROOT}/.git" ]]; then
    git -C "$APP_ROOT" fetch origin
    git -C "$APP_ROOT" checkout "$BRANCH"
    git -C "$APP_ROOT" pull --ff-only origin "$BRANCH"
    log "Repo updated"
  else
    mkdir -p "$(dirname "$APP_ROOT")"
    if [[ -d "$APP_ROOT" ]] && [[ -n "$(ls -A "$APP_ROOT" 2>/dev/null || true)" ]]; then
      die "${APP_ROOT} exists and is not a git repo. Move it aside first."
    fi
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_ROOT"
    log "Repo cloned to ${APP_ROOT}"
  fi
}

write_env() {
  local pass_file="${APP_ROOT}/.db_password"
  local DB_PASS
  DB_PASS="$(cat "$pass_file")"
  local DB_URL="postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}"

  local secret_file="${APP_ROOT}/.better_auth_secret"
  if [[ ! -f "$secret_file" ]]; then
    openssl rand -hex 32 > "$secret_file"
    chmod 600 "$secret_file"
  fi
  local AUTH_SECRET
  AUTH_SECRET="$(cat "$secret_file")"

  mkdir -p "$MEDIA_ROOT"

  # Backend env
  cat > "${APP_ROOT}/Backend/.env" <<EOF
PORT=${BE_PORT}
FRONTEND_ORIGIN=https://${DOMAIN},https://${WWW}
DATABASE_URL=${DB_URL}
DATABASE_URL_DIRECT=${DB_URL}
BETTER_AUTH_SECRET=${AUTH_SECRET}
BETTER_AUTH_URL=https://${DOMAIN}
MEDIA_ROOT=${MEDIA_ROOT}
MEDIA_PUBLIC_BASE_URL=https://${DOMAIN}/media
RATE_LIMIT_MODE=memory
EOF
  chmod 600 "${APP_ROOT}/Backend/.env"

  # Frontend env (build + runtime)
  cat > "${APP_ROOT}/Frontend/.env.local" <<EOF
BACKEND_URL=http://127.0.0.1:${BE_PORT}
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
NEXT_PUBLIC_APP_URL=https://${DOMAIN}
NEXT_PUBLIC_MEDIA_BASE_URL=https://${DOMAIN}/media
MEDIA_PUBLIC_BASE_URL=https://${DOMAIN}/media
PORT=${FE_PORT}
EOF
  chmod 600 "${APP_ROOT}/Frontend/.env.local"

  log "Env files written (secrets kept on server only)"
}

build_apps() {
  cd "${APP_ROOT}/Backend"
  npm ci
  npm run build
  npm run db:migrate

  cd "${APP_ROOT}/Frontend"
  npm ci
  npm run build

  log "Backend + Frontend built"
}

start_pm2() {
  # Only restart/create OUR apps — never delete others
  cd "${APP_ROOT}/Backend"
  if pm2 describe "$PM2_BE" >/dev/null 2>&1; then
    pm2 restart "$PM2_BE" --update-env
  else
    pm2 start dist/index.js --name "$PM2_BE" --cwd "${APP_ROOT}/Backend"
  fi

  cd "${APP_ROOT}/Frontend"
  if pm2 describe "$PM2_FE" >/dev/null 2>&1; then
    pm2 restart "$PM2_FE" --update-env
  else
    pm2 start npm --name "$PM2_FE" --cwd "${APP_ROOT}/Frontend" -- start -- -p "$FE_PORT"
  fi

  pm2 save
  pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
  log "PM2 apps: ${PM2_FE} :${FE_PORT} | ${PM2_BE} :${BE_PORT}"
}

write_nginx() {
  local conf="/etc/nginx/sites-available/${NGINX_SITE}"

  # Never overwrite if someone customized it unless we control it
  cat > "$conf" <<EOF
# Managed for greentechagency.com only — do not merge into other vhosts
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW};

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:${FE_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }
}
EOF

  ln -sfn "$conf" "/etc/nginx/sites-enabled/${NGINX_SITE}"
  nginx -t
  systemctl reload nginx
  log "Nginx site '${NGINX_SITE}' enabled (other sites untouched)"
}

cmd_ssl() {
  need_root
  [[ -f "/etc/nginx/sites-available/${NGINX_SITE}" ]] || die "Run deploy first"
  certbot --nginx -d "$DOMAIN" -d "$WWW" --non-interactive --agree-tos --register-unsafely-without-email --redirect || \
    certbot --nginx -d "$DOMAIN" -d "$WWW" --agree-tos --redirect
  nginx -t && systemctl reload nginx
  log "SSL installed for ${DOMAIN} + ${WWW}"
}

cmd_deploy() {
  need_root
  cmd_inspect
  if ! port_free "$FE_PORT"; then die "FE_PORT ${FE_PORT} busy — edit script and re-run"; fi
  if ! port_free "$BE_PORT"; then die "BE_PORT ${BE_PORT} busy — edit script and re-run"; fi

  install_base
  clone_or_update
  setup_db
  write_env
  build_apps
  start_pm2
  write_nginx

  echo
  log "HTTP deploy complete."
  warn "1) GoDaddy: set A @ → 72.61.19.3 and A www → 72.61.19.3"
  warn "2) Wait for DNS, then run: bash $0 ssl"
  warn "3) Optional seed: cd ${APP_ROOT}/Backend && npm run content:import"
  echo
  pm2 list | grep -E "greentech|Name" || pm2 list
}

cmd_update() {
  need_root
  clone_or_update
  write_env
  build_apps
  start_pm2
  nginx -t && systemctl reload nginx
  log "Update complete"
}

case "${1:-}" in
  inspect) cmd_inspect ;;
  deploy)  cmd_deploy ;;
  ssl)     cmd_ssl ;;
  update)  cmd_update ;;
  *)
    echo "Usage: $0 {inspect|deploy|ssl|update}"
    exit 1
    ;;
esac
