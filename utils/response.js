function sendResponse(
    res,
    {
        success = true,
        code = 'OK',
        message = 'Request successful',
        data = null,
        status = 200
    } = {}
) {
    return res.status(status).json({
        success,
        code,
        message,
        data,
        timestamp: new Date().toISOString()
    });
}

module.exports = {
    sendResponse
};