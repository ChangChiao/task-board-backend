const mongoose = require('mongoose');
const app = require('./app');
const http = require("http");
const config = require('./config/config');
const logger = require('./config/logger');
const socket = require('./services/socket.service');
const server = http.createServer(app);
const io = socket(server)
app.set('socketio', io);
mongoose.connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');
  server.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

require('./config/passport')
require("./services/scheduling");

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
