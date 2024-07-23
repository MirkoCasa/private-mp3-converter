require('dotenv').config();
const express = require('express');
const logger  = require('./logger/logger');
const service = require('./service/ytdl-service');
const app = express();
const cors = require('cors');

app.use(cors());
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).send('Nothing to do here...');
});

app.get('/info', (req, res) => {
    service.getInfo(req, res);
});

app.get('/download', (req, res) => {
    service.downloadAudio(req, res);
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});