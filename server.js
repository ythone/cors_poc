import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json({limit:'2mb'}));

const LOGS = [];

app.get('/', (_,res)=>res.send('Collector up. POST JSON to /collect, view /logs'));
app.post('/collect', (req,res)=>{
  LOGS.push({
    time: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    data: req.body
  });
  res.sendStatus(204);
});
app.get('/logs', (_,res)=>{
  const rows = LOGS.slice().reverse().map((l,i)=>
    `<tr><td>${i+1}</td><td>${l.time}</td><td>${l.ip}</td><td><pre>${JSON.stringify(l.data,null,2).replace(/</g,'&lt;')}</pre></td></tr>`
  ).join('');
  res.send(`<!doctype html><meta charset="utf-8"><title>Logs</title>
  <style>body{font:14px system-ui;margin:24px}pre{white-space:pre-wrap;background:#111;color:#0f0;padding:12px;border-radius:8px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}</style>
  <h1>Collected logs</h1><table><thead><tr><th>#</th><th>Time</th><th>IP</th><th>Data</th></tr></thead><tbody>${rows||'<tr><td colspan=4>No logs yet</td></tr>'}</tbody></table>`);
});

app.listen(process.env.PORT || 8089, ()=>console.log('Collector listening'));
