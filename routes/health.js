const express = require('express');

const { sendResponse } = require('../utils/response');

const router = express.Router();

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

module.exports = router;