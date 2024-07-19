const path = require('path');
const winston = require('winston');
const { combine, timestamp, label, printf, colorize } = winston.format;

const getLabel = () => {
    return require('../package.json').name;
}

const customFormat = printf(({ level, message, label, timestamp }) => {
    return `[${timestamp}][${label}][${level}]${message}`;
});

const logger = winston.createLogger({
    format: combine(
        label({ label: getLabel()}),
        winston.format.timestamp({ format: process.env.LOGGER_TS_FORMAT }),
        timestamp(),
        colorize({ level: true, message: false }),
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

module.exports = logger;