### node-common

Ready to use logger using morgan and winston.

#### Instructions 

`npm i node-common`

`const common = require("node-common")(SERVICE_NAME, LOG_DIR);`

`const obj = {`

`  port: process.env.PORT || "4001", // should be configured in env folder`

`  logger: common.logger,`

`  middlewares: common.middlewares`

`};`

`app
    .start(obj)
    .then(server => {
      common.logger.appLogger.info(${SERVICE_NAME}:${obj.port} started);
    })
    .catch(err => {
      common.logger.appLogger.error(
        Could not start server because of the error ${err},
        process.exit(1)
      );
    });`

#### License
MIT
