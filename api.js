require('dotenv').config();

const express = require('express');
const path = require('path');

const xboxRoutes = require('./routes/xbox');

const app = express();

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT) || 8787;

app.use(express.json());

app.use('/', xboxRoutes);

app.listen(PORT, HOST, () => {
    console.log(`Xbox API listening on port ${PORT}`);
    console.log(`Local URL: http://127.0.0.1:${PORT}`);
    console.log(`Environment file: ${path.resolve('.env')}`);
});