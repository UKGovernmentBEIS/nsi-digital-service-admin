const { format, createLogger, transports } = require("winston");

const { timestamp, combine, errors, simple } = format;

const logger = createLogger({
  format: combine(timestamp(), errors({ stack: true }), simple()),
  transports: [new transports.Console()],
});

module.exports = {
  logger,
};
