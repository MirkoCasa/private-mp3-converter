const ytdl = require('@distube/ytdl-core');
const options = require('../config/options.json');
const { VideoNotFoundError, MissingUrlError, DownloadError } = require('../error/errors');
const logger = require('../logger/logger');

async function getInfo(req, res) {
    try {
        const videoInfo = await getInformationsFromVideo(req, res);
        logger.info(`[ytdl-service][getInfo] Getting informations of Youtube video '${videoInfo.videoDetails.title}'`);
        res.json(videoInfo);
        logger.info(`[ytdl-service][getInfo] Informations sended to client succesfully`);
    } catch (err) {
        logger.error(`[ytdl-service][getInfo] ${err.error}`);
        res.status(err.statusCode instanceof Number ? err.statusCode : 500).json(err.error);
    }
}

async function downloadAudio(req, res) {
    try {
        const videoInfo = await getInformationsFromVideo(req);
        logger.info(`[ytdl-service][downloadAudio] Downloading audio from Youtube video '${videoInfo.videoDetails.title}'`);    
        
        logger.info('[ytdl-service][downloadAudio] Setting up response headers');
        res.headers = getHeaders(videoInfo);
    
        getAudioFromVideo(req, res);
    } catch (err) {
        logger.error(`[ytdl-service][downloadAudio]${err.error}`);
        res.status(err.statusCode instanceof Number ? err.statusCode : 500).json(err.error);
    }
}

const getInformationsFromVideo = async (req) => {
    if(!req.query || !req.query.url) {
        throw new MissingUrlError(`No URL was found to retrieve video's informations`);
    }

    try {
        return await ytdl.getInfo(req.query.url);
    } catch (err) {
        throw new VideoNotFoundError(`No video was found for URL '${req.query.url}'`);
    }
}

const getAudioFromVideo = async (req, res) => {
    await ytdl(req.query.url, options).pipe(res)
        .on('finish', () => {
            logger.info(`[ytdl-service][getAudioFromVideo] Download completed succesfully`);
        })
        .on('error', (err) => {
            throw new DownloadError(`Something went wrong while downloading the audio: ${err}`);
        });
}

const getHeaders = (videoInfo) => {
    return {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${videoInfo.videoDetails.videoId}.mp3"`
    }
}

module.exports = { downloadAudio, getInfo };