# CORS PoC (local lab)

This repo spins up **two servers** on your machine:

- **Target (vulnerable)**: `http://localhost:8081`
- **Exploit**: `http://localhost:8080`

## Quick start (no-credentials CORS demo)

1. Install deps
   ```bash
   cd cors-poc
   npm i
   ```

2. Start the target in **permissive, no-credentials** mode:
   ```bash
   ALLOW_ALL=true node target-server.js
   ```
   This sets `Access-Control-Allow-Origin: *` on `/accountDetails` **without** requiring auth.

3. In another terminal, start the exploit server:
   ```bash
   node exploit-server.js
   ```

4. Visit the exploit page:
   - Open http://localhost:8080/
   - Click **“Open /exploit”** (or open http://localhost:8080/exploit directly).
   - You should see logs appear at http://localhost:8080/logs with the JSON response from the target.

## Credentialed CORS demo (needs HTTPS)

To test `withCredentials` end-to-end, you need HTTPS + `SameSite=None; Secure` cookies. Simplest options:
- Run through a local reverse proxy that provides HTTPS (e.g., Caddy, Nginx, or `mkcert` + Node HTTPS), or
- Put both behind a dev domain that resolves to 127.0.0.1 with a trusted cert.

Then start the target like this:
```bash
REFLECT_ORIGIN=true ALLOW_CREDS=true AUTH_REQUIRED=true node target-server.js
```
Steps:
1. In your browser, visit the target and “Log in”: http://localhost:8081/login
2. On the exploit server homepage, set `USE_CREDS=true` in the environment and restart if needed:
   ```bash
   USE_CREDS=true node exploit-server.js
   ```
3. Open http://localhost:8080/exploit → if HTTPS + cookies are correctly set, the exploit will read your authenticated JSON and exfiltrate it to `/logs`.

> Note: Without HTTPS, modern browsers will not send cross-site cookies with `SameSite=None; Secure`. For a quick demo, stick to the **no-credentials** mode above.

## Endpoints

### Exploit server (`http://localhost:8080`)
- `GET /` — Helper homepage
- `GET /exploit` — The PoC page that fetches the target and exfiltrates to `/collect`
- `GET /deliver-to-victim` — A page that silently loads `/exploit` in an iframe (simulates “deliver to victim”)
- `GET /collect?k=...` — Exfil endpoint; stores data in memory
- `GET /logs` — Shows collected logs

Env vars:
- `TARGET_ORIGIN` (default `http://localhost:8081`)
- `USE_CREDS` (`true` or `false` — default `false`)

### Target server (`http://localhost:8081`)
- `GET /` — Info page
- `GET /login` — Sets a session cookie (for credentialed demo)
- `GET /accountDetails` — Returns JSON containing an `apikey` and other fields
- `OPTIONS *` — Preflight responder

Env vars:
- **CORS behavior**
  - `ALLOW_ALL=true` → `Access-Control-Allow-Origin: *`
  - `REFLECT_ORIGIN=true` → `Access-Control-Allow-Origin: <request Origin>`
  - `ALLOW_CREDS=true` → `Access-Control-Allow-Credentials: true`
  - (You can combine `REFLECT_ORIGIN=true` and `ALLOW_CREDS=true` to emulate credentialed CORS misconfig.)

- **Auth behavior**
  - `AUTH_REQUIRED=true` → `/accountDetails` requires the cookie `session=poc` (set via `/login`)

## Legal & Safety
Only use these materials in controlled environments or with explicit permission (e.g., your own lab or an authorized bug bounty program). This project is for education and defensive testing.
