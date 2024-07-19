class MissingUrlError extends Error {
  constructor(msg, statusCode = 400) {
    super(msg);
    this.error = msg;
    this.statusCode = statusCode;
  }
}

class VideoNotFoundError extends Error {
    constructor(msg, statusCode = 404) {
        super(msg);
        this.error = msg;
        this.statusCode = statusCode;
      } 
}

class DownloadError extends Error {
    constructor(msg, statusCode = 500) {
        super(msg);
        this.error = msg;
        this.statusCode = statusCode;
      } 
}

module.exports = { MissingUrlError, VideoNotFoundError, DownloadError };
