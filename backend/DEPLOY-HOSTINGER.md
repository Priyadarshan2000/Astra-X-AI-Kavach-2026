# ASTRA-X Backend — Hostinger Deploy

**Live backend URL:** [https://tan-hummingbird-842514.hostingersite.com](https://tan-hummingbird-842514.hostingersite.com)

Upload the `backend/` folder contents to **`public_html/`** on Hostinger (site root) so endpoints resolve as:

`https://tan-hummingbird-842514.hostingersite.com/login.php`

## 1. Create deploy zip (local)

```bash
chmod +x scripts/package-hostinger.sh
./scripts/package-hostinger.sh
```

This creates `dist/astra-x-backend-hostinger.zip` including your configured `secrets.php`.

## 2. Upload to Hostinger

1. hPanel → **Files** → **File Manager**
2. Open `public_html`
3. Delete the default `index.html` placeholder page
4. Upload `dist/astra-x-backend-hostinger.zip` into `public_html`
5. Extract the zip (PHP files should sit directly under `public_html/`)

Expected layout:

```
public_html/
├── index.php
├── health.php
├── login.php
├── config/secrets.php
└── uploads/
```

## 3. Import database tables

1. hPanel → **Databases** → **phpMyAdmin**
2. Select database `u262006317_priyaastrax`
3. **Import** → choose `database/schema-hostinger.sql` from this repo
4. Run import

## 4. Seed demo operator

Open in browser (one time):

```
https://tan-hummingbird-842514.hostingersite.com/setup.php?key=kavach-astra-setup-2026
```

Expected JSON: demo operator `operator@astra.mil` / `AstraX#2026` seeded.

**Delete `setup.php` from the server after seeding.**

## 5. Verify API

```
https://tan-hummingbird-842514.hostingersite.com/health.php
```

Look for `"status": "ready"`.

Test login:

```bash
curl -X POST https://tan-hummingbird-842514.hostingersite.com/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"operator@astra.mil","password":"AstraX#2026"}'
```

## 6. Connect Vercel frontend

In Vercel project settings → Environment Variables:

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `https://tan-hummingbird-842514.hostingersite.com` |

Redeploy the frontend after setting the variable.

Local production build already uses `frontend/.env.production` with this URL.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Default Hostinger page still shows | Delete `index.html`; ensure `index.php` exists in `public_html` |
| 500 on all endpoints | Check PHP 8+ is enabled; verify `secrets.php` DB credentials |
| `database: false` in health | Confirm database name/user/password in hPanel match `secrets.php` |
| `missing_tables` | Re-import `schema-hostinger.sql` |
| Login works but scan/patch 401 | Apache may strip `Authorization` — `.htaccess` rewrite rule is included |
| CORS errors from Vercel | Add your Vercel URL to `ASTRA_CORS_ORIGINS` in `secrets.php` |

## PHP requirements

- PHP 8.0+
- Extensions: `pdo_mysql`, `json`, `mbstring`
