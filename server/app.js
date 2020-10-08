const express = require("express");
const path = require("path");
const jwt = require("express-jwt");
const jwtDecode = require("jwt-decode");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const tonersRouter = require("./controllers/tonerController");
const usersRouter = require("./controllers/userController");
const loginRouter = require("./controllers/loginController");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const app = express();

async function connect() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.info("Mongoose error", error);
  }
}

connect();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

const attachUser = (request, response, next) => {
  const token = request.headers.authorization;
  if (!token) {
    return response.status(401).json({ message: "Authentication invalid" });
  }
  const decodedToken = jwtDecode(token.slice(7));
  if (!decodedToken) {
    return response.status(401).json({
      message: "There was a problem authorizing the request",
    });
  }
  // should be request.user

  request.user = decodedToken;
  return next();
};

app.use("/api/login", loginRouter);

// app.patch("/api/user-role", async (request, response) => {
//   try {
//     const { role } = request.body;
//     const allowedRoles = ["user", "admin"];

//     if (!allowedRoles.includes(role)) {
//       return response.status(400).json({ message: "Role not allowed" });
//     }
//     await User.findOneAndUpdate({ _id: request.user.sub }, { role });
//     response.json({
//       message:
//         "User role updated. You must log in again for the changes to take effect.",
//     });
//   } catch (error) {
//     return response.status(400).json({ error });
//   }
// });

app.use("/api/toners", tonersRouter);

app.use("/api/users", usersRouter);

app.get("/*", (request, response) => {
  response.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(attachUser);

app.use(middleware.requestLogger);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
