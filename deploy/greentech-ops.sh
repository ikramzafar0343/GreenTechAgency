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

  # -H 127.0.0.1: Next.js is reachable only through Nginx, not on the public IP.
  if as_app "pm2 describe '$PM2_FE'" >/dev/null 2>&1; then
    as_app "pm2 restart '$PM2_FE' --update-env"
  else
    as_app "cd '${APP_ROOT}/Frontend' && pm2 start npm --name '$PM2_FE' -- start -- -p '$FE_PORT' -H 127.0.0.1"
  fi

  as_app "pm2 save"
  env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$APP_USER" --hp "/home/${APP_USER}" >/dev/null 2>&1 || true
  log "PM2 apps (user ${APP_USER}): ${PM2_FE} 127.0.0.1:${FE_PORT} | ${PM2_BE} 127.0.0.1:${BE_PORT}"
}

# Licensed fonts are not in git. Upload them once to FONT_DIR, e.g.:
#   scp Frontend/src/styles/fonts/*.woff root@SERVER:/var/www/greentechagency-private/fonts/
FONT_DIR="${FONT_DIR:-/var/www/greentechagency-private/fonts}"

build_frontend() {
  local target="${APP_ROOT}/Frontend/src/styles/fonts"
  if ! ls "${FONT_DIR}"/*.woff >/dev/null 2>&1; then
    die "Licensed fonts missing. Upload nourd_light.woff, nourd_regular.woff and nourd_medium.woff to ${FONT_DIR}"
  fi
  mkdir -p "$target"
  cp "${FONT_DIR}"/*.woff "$target"/
  chown -R "$APP_USER:$APP_USER" "$target"
  as_app "cd '${APP_ROOT}/Frontend' && npm ci && npm run build"
}

