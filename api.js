require('dotenv').config();

const express = require('express');
const { execFile } = require('child_process');

const { sendResponse } = require('./utils/response');

const app = express();

app.use(express.json());

const XBOX_IP = process.env.XBOX_IP;
const PORT = Number(process.env.PORT) || 8787;

console.log('Konfiguration:', {
    envDatei: require('path').resolve('.env'),
    port: PORT,
    xboxIp: XBOX_IP
});

// API-Grundfunktion testen
app.get('/health', (req, res) => {
    return sendResponse(res, {
        success: true,
        code: 'API_OK',
        message: 'API ist erreichbar',
        data: {
            api: 'ok'
        }
    });
});

// Xbox-Netzwerkerreichbarkeit prüfen
app.get('/xbox/status', (req, res) => {
    if (!XBOX_IP) {
        return sendResponse(res, {
            success: false,
            code: 'XBOX_IP_MISSING',
            message: 'Xbox-IP ist nicht konfiguriert',
            status: 500
        });
    }

    execFile(
        'ping',
        ['-c', '1', '-W', '2', XBOX_IP],
        (err) => {
            return sendResponse(res, {
                success: true,
                code: err ? 'XBOX_UNREACHABLE' : 'XBOX_REACHABLE',
                message: err
                    ? 'Xbox ist über ping nicht erreichbar'
                    : 'Xbox ist über ping erreichbar',
                data: {
                    ip: XBOX_IP,
                    reachable: !err,
                    note: 'Netzwerkerreichbarkeit, kein garantierter Konsolenstatus'
                }
            });
        }
    );
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Xbox API läuft auf http://127.0.0.1:${PORT}`);
});