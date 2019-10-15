const lib = require("./lib");
const middlewares = require("./middlewares");

// Docs

/**
 * @typedef {Object} Logger
 * @property {appLogger} Logger.appLogger - general application logger.
 * @property {httpLogger} Logger.httpLogger - general httpLogger.
 * @property {morganLogger} Logger.morganLogger - stream logger for morgan
 */

/**
 * @typedef {Object} Common
 * @property {Logger} logger - logger
 * @property {Object} helpers - all exposed helpers
 * @property {Object} middlewares - middlewares
 */

/**
 * Returns a common helpers and library.
 * @param {string} applicationName - Name of the application.
 * @returns {Common} object with Common properties
 */

function common(applicationName) {
  const logger = lib.logger(applicationName);
  return {
    logger,
    middlewares
  };
}

module.exports = common;
