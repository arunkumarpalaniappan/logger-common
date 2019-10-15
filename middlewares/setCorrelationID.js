const uuid = require("uuid/v4");
/**
 * setCorrelationId sets the correlationId on the header of the request
 * By default setting it as x-correlation-id. It can be set as an
 * 'x-request-id' too.
 */
function setCorrelationId() {
  return (req, res, next) => {
    // uuid.v4 to for each incoming request generate the unique identifier.
    if (req && !req.headers["x-correlation-id"]) {
      req.x_correlation_id = uuid();
      res.setHeader("X-Correlation-ID", req.x_correlation_id);
    }
    next();
  };
}

module.exports = setCorrelationId;
