const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./utils/config");

const tonersRouter = require("./controllers/tonerController");
const usersRouter = require("./controllers/userController");
const loginRouter = require("./controllers/loginController");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const app = express();

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

app.use(middleware.tokenExtractor);

app.use("/api/toners", tonersRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.requestLogger);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
