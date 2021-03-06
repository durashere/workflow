const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const path = require("path");
const jwtDecode = require("jwt-decode");

require("dotenv").config();

const loginRouter = require("./controllers/loginController");
const tonersRouter = require("./controllers/tonerController");
const tonersLogsRouter = require("./controllers/tonerLogController");
const usersRouter = require("./controllers/userController");
const cmssRouter = require("./controllers/cmsController");

const logger = require("./config/winston");

const app = express();

let DATABASE = process.env.MONGO_URL;

if (process.env.NODE_ENV === "development") {
  DATABASE = process.env.MONGO_URL_DEV;
}
if (process.env.NODE_ENV === "test") {
  DATABASE = process.env.MONGO_URL_TEST;
}

async function connect() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    mongoose.set("toJSON", { virtuals: true });
    logger.info(`Connected to MongoDB ${process.env.NODE_ENV}`);
  } catch (error) {
    logger.info("Mongoose error", error);
  }
}

connect();
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev", { stream: logger.stream.write }));
}

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../frontend/build")));

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
app.use("/api/tonerslogs", tonersLogsRouter);

app.use("/api/users", usersRouter);

app.use("/api/cmss", cmssRouter);

app.get("/*", (request, response) => {
  response.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

app.use(attachUser);

module.exports = app;
