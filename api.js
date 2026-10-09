require('dotenv').config();

const express = require('express');

const logger = require('./utils/logger');
const healthRoutes = require('./routes/health');
const xboxRoutes = require('./routes/xbox');

const app = express();

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT) || 8787;

app.use(express.json());

app.use('/', healthRoutes);
app.use('/xbox', xboxRoutes);

app.listen(PORT, HOST, () => {
    logger.info('[NUBIA-XBOX-CONTROLLER] is started and running.');
    logger.info(`Host: ${HOST}`);
    logger.info(`Port: ${PORT}`);
    logger.info(`Local URL: http://127.0.0.1:${PORT}`);
    logger.info(`File logging: ${process.env.LOG_TO_FILE === 'true' ? 'enabled' : 'disabled'}`);
});