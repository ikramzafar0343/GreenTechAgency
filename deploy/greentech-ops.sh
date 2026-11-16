#!/usr/bin/env bash
# Helpers sourced by hostinger-greentech.sh. Expects APP_USER, APP_ROOT, DB_NAME,
# BACKUP_DIR, BACKUP_KEEP, FONT_DIR (optional), PM2_BE, PM2_FE, FE_PORT, BE_PORT and the log/warn/die functions to be defined by the caller.

ensure_app_user() {
  if ! id "$APP_USER" >/dev/null 2>&1; then
    useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"
    log "Created system user ${APP_USER}"
  fi
  chown -R "$APP_USER:$APP_USER" "$APP_ROOT"
}

# Runs a command as the app user with its own HOME (pm2, npm caches live there).
as_app() {
  sudo -u "$APP_USER" -H bash -lc "$*"
}

backup_db() {
  mkdir -p "$BACKUP_DIR"
  chmod 700 "$BACKUP_DIR"
  if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    warn "No database yet; skipping backup"
    return
  fi
  local file="${BACKUP_DIR}/${DB_NAME}-$(date +%Y%m%d-%H%M%S).dump"
  sudo -u postgres pg_dump --format=custom "$DB_NAME" > "$file"
  chmod 600 "$file"
  ls -1t "${BACKUP_DIR}"/*.dump 2>/dev/null | tail -n +$((BACKUP_KEEP + 1)) | xargs -r rm -f
  log "Database backup written: ${file} (keeping last ${BACKUP_KEEP})"
  warn "Copy backups off this server regularly (rsync/rclone) — a VPS failure loses local copies too."
}

start_pm2() {
  # Older deploys ran our two apps under root's PM2; move only those two.
  for app in "$PM2_BE" "$PM2_FE"; do
    if pm2 describe "$app" >/dev/null 2>&1; then
      pm2 delete "$app" >/dev/null 2>&1 || true
      pm2 save >/dev/null 2>&1 || true
      warn "Moved ${app} from root PM2 to user ${APP_USER}"
    fi
  done

  if as_app "pm2 describe '$PM2_BE'" >/dev/null 2>&1; then
    as_app "pm2 restart '$PM2_BE' --update-env"
  else
    as_app "cd '${APP_ROOT}/Backend' && pm2 start dist/index.js --name '$PM2_BE'"
  fi

  # Bind "localhost", not 127.0.0.1. Next normalizes 127.0.0.1 to localhost
  # inside middleware, then proxies https://localhost:PORT and returns 500.
  # `pm2 restart` keeps the old -H, so recreate the process every update.
  if as_app "pm2 describe '$PM2_FE'" >/dev/null 2>&1; then
    as_app "pm2 delete '$PM2_FE'" >/dev/null 2>&1 || true
  fi
  as_app "cd '${APP_ROOT}/Frontend' && pm2 start npm --name '$PM2_FE' -- start -- -p '$FE_PORT' -H localhost"

  as_app "pm2 save"
  env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$APP_USER" --hp "/home/${APP_USER}" >/dev/null 2>&1 || true

  local upstream="127.0.0.1"
  local i
  for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
    if ss -tln | grep -qE "[:.]${FE_PORT}\\b"; then
      break
    fi
    sleep 1
  done
  if ss -tln | grep -qE "\\[::1\\]:${FE_PORT}\\b" && ! ss -tln | grep -qE "127\\.0\\.0\\.1:${FE_PORT}\\b"; then
    upstream="[::1]"
  fi
  if [[ -n "${NGINX_SITE:-}" && -f "/etc/nginx/sites-available/${NGINX_SITE}" ]]; then
    sed -i -E "s#proxy_pass http://(127\\.0\\.0\\.1|\\[::1\\]|localhost):${FE_PORT};#proxy_pass http://${upstream}:${FE_PORT};#" \
      "/etc/nginx/sites-available/${NGINX_SITE}"
    nginx -t && systemctl reload nginx
  fi
  log "PM2 apps (user ${APP_USER}): ${PM2_FE} ${upstream}:${FE_PORT} | ${PM2_BE} 127.0.0.1:${BE_PORT}"
}

# Licensed fonts are not in git. Upload them once to FONT_DIR, e.g.:
#   scp Frontend/src/styles/fonts/*.woff root@SERVER:/var/www/greentechagency-private/fonts/
FONT_DIR="${FONT_DIR:-/var/www/greentechagency-private/fonts}"

build_frontend() {
  local target="${APP_ROOT}/Frontend/src/styles/fonts"
  mkdir -p "$FONT_DIR" "$target"

  # Prefer WOFF; if only TTF is present, convert once with fonttools.
  if ! ls "${FONT_DIR}"/nourd_light.woff "${FONT_DIR}"/nourd_regular.woff "${FONT_DIR}"/nourd_medium.woff >/dev/null 2>&1; then
    if ls "${FONT_DIR}"/nourd_light.ttf "${FONT_DIR}"/nourd_regular.ttf "${FONT_DIR}"/nourd_medium.ttf >/dev/null 2>&1; then
      command -v python3 >/dev/null 2>&1 || die "python3 required to convert TTF→WOFF"
      python3 - <<'PY' || die "fonttools missing — run: pip3 install fonttools"
from fontTools.ttLib import TTFont
from pathlib import Path
d = Path("/var/www/greentechagency-private/fonts")
for name in ("nourd_light", "nourd_regular", "nourd_medium"):
    font = TTFont(d / f"{name}.ttf")
    font.flavor = "woff"
    font.save(d / f"{name}.woff")
    print(f"converted {name}.woff")
PY
      log "Converted TTF fonts to WOFF in ${FONT_DIR}"
    else
      die "Licensed fonts missing. Upload nourd_light/regular/medium .woff (or .ttf) to ${FONT_DIR}, then re-run update"
    fi
  fi

  cp "${FONT_DIR}"/nourd_light.woff "${FONT_DIR}"/nourd_regular.woff "${FONT_DIR}"/nourd_medium.woff "$target"/
  chown -R "$APP_USER:$APP_USER" "$target"
  as_app "cd '${APP_ROOT}/Frontend' && npm ci && npm run build"
}

