require('dotenv').config();
const express = require('express');
const logger  = require('./logger/logger');
const ytdl = require('./service/ytdl-service');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/info', (req, res) => {
    ytdl.getInfo(req, res);
});

app.get('/download', (req, res) => {
    ytdl.downloadAudio(req, res);
});

app.listen(process.env.PORT, () => {
    logger.info(`[app] Server is running on port ${process.env.PORT}`);
});