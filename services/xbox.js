const Smartglass = require('xbox-smartglass-core-node');

function getXboxConfig() {
    const ip = process.env.XBOX_IP;

    if (!ip) {
        throw new Error('XBOX_IP is not configured.');
    }

    return {
        ip
    };
}

async function getXboxStatus() {
    const config = getXboxConfig();
    const client = Smartglass();

    await client.connect(config.ip);

    try {
        return {
            ip: config.ip,
            smartglassConnected: true,
            liveId: client._console.getLiveid()
        };
    } finally {
        client.disconnect();
    }
}

module.exports = {
    getXboxConfig,
    getXboxStatus
};