const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // Keep stack traces
    format.json()
  ),
  transports: [
    new transports.Console(), // Logs to console (Railway)
    new transports.File({ filename: 'logs/autoflow.log' }) // Logs to file
  ],
});

module.exports = logger;