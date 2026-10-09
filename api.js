const express = require('express');

const app = express();
app.use(express.json());

const XBOX_IP = '192.168.1.117';
const PORT = 8787;

// API-Grundfunktion testen
app.get('/health', (req, res) => {
res.json({ api: 'ok' });
});

// Xbox-Netzwerkerreichbarkeit prüfen
app.get('/xbox/status', (req, res) => {
const { execFile } = require('child_process');

execFile('ping', ['-c', '1', '-W', '2', XBOX_IP], (err) => {
res.json({
ip: XBOX_IP,
reachable: !err,
note: 'Netzwerkerreichbarkeit, kein garantierter Konsolenstatus'
});
});
});

app.listen(PORT, '127.0.0.1', () => {
console.log("Xbox API läuft auf http://127.0.0.1:${PORT}");
});