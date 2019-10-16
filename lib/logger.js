const serializeError = require("serialize-error");
const winston = require("winston");

const winstonConfig = require("./loggerConfig/winstonConfig");
const morganFormat = require("./loggerConfig/morganFormat");

const instanceTable = [];

const corelationExtractor = req => {
  let correlationId;
  if (req && req.headers) {
    correlationId = req.headers["x-correlation-id"];
  }
  if (!correlationId) {
    correlationId = req.x_correlation_id;
  }
  return correlationId;
};

/**
 * Class representing a Logger of Type Application.
 * @public
 */
class AppLogger {
  /**
   * Create a Application Logger.
   * @param {string} applicationName - The Application Name.
   * @private
   */
  constructor(applicationName) {
    this.applicationName = applicationName;
  }
  /**
   * Log the Application info message.
   * @param {*} message - message to log
   */
  info(message) {
    winstonConfig.loggerApp.log("info", `"appName": ${this.applicationName}`, {
      message,
    });
  }
  /**
   * Log the Application error message.
   * @param {*} message - message to log
   */
  error(message) {
    const errorMessage = serializeError(message);
    const metaData = {
      classification: "operational-error",
      appName: this.applicationName,
      error: errorMessage,
    };
    winstonConfig.loggerApp.log("error", `"appName": ${this.applicationName}`, {
      metaData,
    });
  }
}

/**
 * Class representing a Logger of Type HTTP.
 * @public
 */
class HTTPLogger {
  /**
   * Create a HTTP Logger.
   * @param {string} applicationName - The Application Name.
   * @private
   */
  constructor(applicationName) {
    this.applicationName = applicationName;
  }
  /**
   * Log the HTTP info message.
   * @param {*} req - req object
   * @param {*} message - message
   */
  info(req, message) {
    const metaData = {
      correlationId: corelationExtractor(req),
      error: message,
    };
    winstonConfig.loggerHTTP.log("info", `"appName": ${this.applicationName}`, {
      info: metaData,
    });
  }
  /**
   * Log the HTTP error message.
   * @param {*} req - req object
   * @param {*} message - message
   */
  error(req, message) {
    const errorMessage = serializeError(message);
    const metaData = {
      correlationId: corelationExtractor(req),
      appName: this.applicationName,
      error: errorMessage,
    };
    winstonConfig.loggerHTTP.log(
      "error",
      `"appName": ${this.applicationName}`,
      {
        error: metaData,
      },
    );
    winston.log("error", `"appName": ${this.applicationName}`, metaData);
  }
}

/**
 * Class Representing the Morgran Logger type.
 * @public
 */
class MorganLogger {
  /**
   * Create a Morgan Logger.
   * @param {string} applicationName - The Application Name.
   * @private
   */
  constructor(applicationName) {
    this.applicationName = applicationName;
    this.format = morganFormat(applicationName);
    this.stream = winstonConfig.morganLoggerStream;
  }
}
/**
 * Class encapsulating the all Logger type.
 * @global
 */
class Logger {
  /**
   * Create a Logger.
   * @param {string} applicationName - The Application Name.
   * @private
   */
  constructor(applicationName) {
    this.applicationName = applicationName;
    this.appLogger = new AppLogger(applicationName);
    this.httpLogger = new HTTPLogger(applicationName);
    this.morganLogger = new MorganLogger(applicationName);
    this.appLogger.info("info", "logger initialized", {
      appName: applicationName,
    });
  }
}

function logger(applicationName, logDir) {
  if (instanceTable.length === 0) {
    instanceTable.push(new Logger(applicationName));
  }
  winstonConfig.init(logDir);
  const log = instanceTable[0];
  const logAccess = new Proxy(log, {
    get(target, property) {
      return target[property];
    },
    set(target, property, value) {
      throw new Error(`setting new value "${property} = ${value}" not allowed`);
    },
  });
  return logAccess;
}

module.exports = logger;
