const { createLogger, format, transports } = require("winston");

const { combine, splat, timestamp, printf, json, colorize } = format;

const myFormat = printf(({ level, timestamp, message }) => {
  const msg = `[${level}] [${timestamp}]: ${message}`;

  return msg;
});

// eslint-disable-next-line new-cap
const logger = new createLogger({
  format: combine(
    timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    splat(),
    json(),
  ),

  transports: [
    new transports.File({
      level: "error",
      filename: "./logs/error.log",
    }),
    new transports.File({
      level: "info",
      filename: "./logs/info.log",
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({
          format: "DD-MM-YYYY HH:mm:ss",
        }),
        myFormat,
      ),
    }),
    new transports.Http({
      level: "warn",
      format: json(),
    }),
  );
}

module.exports = logger;
