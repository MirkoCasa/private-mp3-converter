require('dotenv').config();
const express = require('express');
const logger  = require('./logger/logger');
const service = require('./service/ytdl-service');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('Nothing to do here...');
});

app.get('/info', (req, res) => {
    service.getInfo(req, res);
});

app.get('/download', (req, res) => {
    service.downloadAudio(req, res);
});

app.listen(process.env.PORT, () => {
    logger.info(`[app] Server is running on port ${process.env.PORT}`);
});