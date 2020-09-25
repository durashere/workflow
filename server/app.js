const express = require("express");
const path = require("path");
const jwt = require("express-jwt");
const jwtDecode = require("jwt-decode");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./utils/config");

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
  } catch (err) {
    logger.info("Mongoose error", err);
  }
}

connect();

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(cors());

// app.use(middleware.tokenExtractor);

const attachUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication invalid" });
  }
  const decodedToken = jwtDecode(token.slice(7));
  if (!decodedToken) {
    return res.status(401).json({
      message: "There was a problem authorizing the request",
    });
  } else {
    // should be req.user
    req.token = decodedToken;
    next();
  }
};

app.use("/api/login", loginRouter);

app.use(attachUser);

// app.get("/api/dashboard-data", requireAuth, (req, res) =>
//   res.json(dashboardData),
// );

// app.patch("/api/user-role", async (req, res) => {
//   try {
//     const { role } = req.body;
//     const allowedRoles = ["user", "admin"];

//     if (!allowedRoles.includes(role)) {
//       return res.status(400).json({ message: "Role not allowed" });
//     }
//     await User.findOneAndUpdate({ _id: req.user.sub }, { role });
//     res.json({
//       message:
//         "User role updated. You must log in again for the changes to take effect.",
//     });
//   } catch (err) {
//     return res.status(400).json({ error: err });
//   }
// });

app.use("/api/toners", tonersRouter);
app.use("/api/users", usersRouter);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(middleware.requestLogger);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
