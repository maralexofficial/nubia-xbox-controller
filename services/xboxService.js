function getXboxConfig() {
    const ip = process.env.XBOX_IP;

    if (!ip) {
        throw new Error('XBOX_IP ist nicht konfiguriert.');
    }

    return {
        ip
    };
}

module.exports = {
    getXboxConfig
};