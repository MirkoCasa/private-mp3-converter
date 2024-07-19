const ytdl = require('@distube/ytdl-core');
const options = require(process.env.OPTIONS_PATH);
const { VideoNotFoundError, MissingUrlError, DownloadError } = require('../error/errors');
const logger = require('../logger/logger');

async function getInfo(req, res) {
    try {
        const videoInfo = await getInformationsFromVideo(req, res);
        logger.info(`[getInfo] Getting informations of Youtube video '${videoInfo.videoDetails.title}'`);
        res.json(videoInfo);
        logger.info(`[getInfo] Informations sended to client succesfully`);
    } catch (err) {
        logger.error(`[downloadAudio] ${err.error}`);
        res.status(err.statusCode).json(err.error);
    }
}

async function downloadAudio(req, res) {
    try {
        const videoInfo = await getInformationsFromVideo(req);
        logger.info(`[downloadAudio] Downloading audio from Youtube video '${videoInfo.videoDetails.title}'`);    
        
        logger.info('[downloadAudio] Setting up response headers');
        res.headers = getHeaders(videoInfo);
    
        getAudioFromVideo(req, res);
    } catch (err) {
        logger.error(`[downloadAudio] ${err.error}`);
        res.status(err.statusCode).json(err.error);
    }
}

const getInformationsFromVideo = async (req) => {
    if(!req.query || !req.query.url) {
        throw new MissingUrlError(`No URL was found to retrieve video's informations`);
    }

    let informations;

    try {
        informations = await ytdl.getInfo(req.query.url);
    } catch (err) {
        throw new VideoNotFoundError(`No video was found for URL '${req.query.url}'`);
    }

    return informations;
}

const getAudioFromVideo = async (req, res) => {
    const stream = await ytdl(req.query.url, options);

    stream.pipe(res);

    stream.on('finish', () => {
        logger.info(`[getAudioFromVideo] Download completed succesfully`);
    })

    stream.on('error', (err) => {
        throw new DownloadError(`Something went wrong while downloading the audio: ${err}`);
    })
}

const getHeaders = (videoInfo) => {
    return {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${videoInfo.videoDetails.videoId}.mp3"`
    }
}

module.exports = { downloadAudio, getInfo };