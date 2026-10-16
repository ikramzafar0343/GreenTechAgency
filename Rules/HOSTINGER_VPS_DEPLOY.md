# Hostinger VPS — Backend deploy checklist

**Local development** still uses `localhost:4000`. This document is for production on a Hostinger VPS.

## Requirements

- Node.js 20+
- Writable directory for media (e.g. `/var/www/greentech/media`)
- PostgreSQL (Neon or Postgres on the VPS)
- Nginx (or Caddy) reverse proxy

## Environment (Backend `.env`)

```
PORT=4000
FRONTEND_ORIGIN=https://your-frontend-domain.com
DATABASE_URL=...
DATABASE_URL_DIRECT=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://your-frontend-domain.com
MEDIA_ROOT=/var/www/greentech/media
MEDIA_PUBLIC_BASE_URL=https://api.your-domain.com/media
RATE_LIMIT_MODE=memory
```

Frontend `.env`:

```
BACKEND_URL=https://api.your-domain.com
```

## Process

```bash
cd Backend
npm ci
npm run db:migrate
npm run build
# pm2 or systemd:
npm start
# or: pm2 start dist/index.js --name greentech-backend
```

## Nginx sketch

```nginx
server {
  server_name api.your-domain.com;
  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 16m;
  }
}
```

Optional: serve media directly from disk:

```nginx
location /media/ {
  alias /var/www/greentech/media/;
  expires 1d;
}
```

(If Nginx serves `/media`, Backend `GET /media` is unused but upload still writes to `MEDIA_ROOT`.)

## First-time ops

1. `npm run db:migrate` (includes Ops/CRM `0003` + `employee_kind` `0004`)
2. `npm run auth:create-admin -- --email … --name … --password …`
3. Optional employee: `npm run auth:create-employee -- --email … --name … --password … --kind sales|delivery`
4. `npm run content:import` (CMS + marketing chrome site documents)
5. Confirm `GET /health`, `GET /media/…` (after upload), and Frontend `BACKEND_URL` reach this host.

## Env checklist (copy/paste)

- [ ] `DATABASE_URL` + `DATABASE_URL_DIRECT`
- [ ] `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL` (= Frontend origin)
- [ ] `FRONTEND_ORIGIN` (= Frontend origin)
- [ ] `MEDIA_ROOT` writable on VPS disk
- [ ] `MEDIA_PUBLIC_BASE_URL` = `https://api.your-domain.com/media`
- [ ] `RATE_LIMIT_MODE=memory`
- [ ] Frontend `BACKEND_URL` = `https://api.your-domain.com`
- [ ] Nginx proxies `/api` and `/media` (or alias `/media` to `MEDIA_ROOT`)
- [ ] Process manager: `pm2` or systemd running `npm start` after `npm run build`
