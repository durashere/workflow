const jwt = require("express-jwt");
const jwtDecode = require("jwt-decode");
const usersRouter = require("express").Router();
const User = require("../models/userModel");

const { createToken, hashPassword } = require("../util");

const requireAuth = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

const requireAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(401).json({ message: "Insufficient role" });
  }
  next();
};

usersRouter.get("/", requireAuth, async (request, response) => {
  try {
    const users = await User.find({});

    response.json(users);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { username, firstName, lastName } = req.body;

    const hashedPassword = await hashPassword(req.body.password);

    const userData = {
      username: username.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      role: "user",
    };

    const existingUsername = await User.findOne({
      username: userData.username,
    }).lean();

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User(userData);

    const savedUser = await newUser.save();

    if (savedUser) {
      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      const { firstName, lastName, username, role } = savedUser;

      const userInfo = {
        firstName,
        lastName,
        username,
        role,
      };

      return res.json({
        message: "User created!",
        token,
        userInfo,
        expiresAt,
      });
    } else {
      return res.status(400).json({
        message: "There was a problem creating your account",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem creating your account",
    });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(201).json({
      message: "User deleted!",
      deletedUser,
    });
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem deleting the user.",
    });
  }
});

module.exports = usersRouter;
