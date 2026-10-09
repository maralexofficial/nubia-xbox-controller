const express = require('express');
const { execFile } = require('child_process');

const { sendResponse } = require('../utils/response');
const { getXboxConfig } = require('../services/xbox');

const router = express.Router();

router.get('/status', (req, res) => {
    let config;

    try {
        config = getXboxConfig();
    } catch (error) {
        return sendResponse(res, {
            success: false,
            code: 'XBOX_CONFIG_ERROR',
            message: 'Xbox configuration is missing.',
            status: 500
        });
    }

    execFile(
        'ping',
        ['-c', '1', '-W', '2', config.ip],
        (err) => {
            return sendResponse(res, {
                success: true,
                code: err ? 'XBOX_UNREACHABLE' : 'XBOX_REACHABLE',
                message: err
                    ? 'Xbox is not reachable via ping'
                    : 'Xbox is reachable via ping',
                data: {
                    ip: config.ip,
                    reachable: !err,
                    note: 'Network reachability only; this does not confirm console status'
                }
            });
        }
    );
});

module.exports = router;