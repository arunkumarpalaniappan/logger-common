/**
 * A module for asynchronous logging to the centrailized server,
 * @module logger
 */
const fs = require("fs");
const path = require("path");
const winston = require("winston");
const appRoot = require("app-root-path");

winston.exitOnError = false;

if (process.env.NODE_ENV === "production") {
  winston.remove(winston.transports.Console);
}

const logDir = `${appRoot}/logs`; // log directory path
if (!fs.existsSync(logDir)) {
  // create the directory if it doesn't exist
  fs.mkdirSync(logDir);
}

// Transporter to log all the particular application error logs
// in the local error log file asynchronously.
const loggerHTTP = new winston.Logger({
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "/combined.log"),
      maxFiles: 5,
      maxsize: 10485760,
    }),
  ],
});

const loggerApp = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      handleExceptions: true,
    }),
  ],
});
// Transporter to log all the particular application logs
// in the local error log file asynchronously. This is used
// as the stream for the morgan http request logger.
const morganLogger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: "info",
      maxFiles: 5,
      maxsize: 10485760,
      filename: path.join(logDir, "/access.log"),
    }),
  ],
});

loggerHTTP.exitOnError = false;
morganLogger.exitOnError = false;
loggerApp.exitOnError = false;

// this stream will be passed to the morgan for writing to the destination
const morganLoggerStream = {
  write(message) {
    winston.log("info", {
      message,
    });
    morganLogger.info(message);
  },
};

module.exports = Object.assign(
  {},
  {
    loggerHTTP,
    loggerApp,
    morganLoggerStream,
  },
);
