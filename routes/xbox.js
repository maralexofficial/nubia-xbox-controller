const express = require('express');
const { execFile } = require('child_process');

const { sendResponse } = require('../utils/response');

const router = express.Router();

const XBOX_IP = process.env.XBOX_IP;

router.get('/health', (req, res) => {
    return sendResponse(res, {
        success: true,
        code: 'API_OK',
        message: 'API is operational',
        data: {
            api: 'ok'
        }
    });
});

router.get('/xbox/status', (req, res) => {
    if (!XBOX_IP) {
        return sendResponse(res, {
            success: false,
            code: 'XBOX_IP_MISSING',
            message: 'Xbox IP address is not configured',
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
                    ? 'Xbox is not reachable via ping'
                    : 'Xbox is reachable via ping',
                data: {
                    ip: XBOX_IP,
                    reachable: !err,
                    note: 'Network reachability only; this does not confirm console status'
                }
            });
        }
    );
});

module.exports = router;