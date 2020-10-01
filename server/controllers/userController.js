const jwt = require("express-jwt");
const jwtDecode = require("jwt-decode");
const usersRouter = require("express").Router();
const User = require("../models/userModel");

const { createToken, hashPassword } = require("../util");

const requireAuth = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

const requireAdmin = (request, response, next) => {
  const { role } = request.user;
  if (role !== "admin") {
    return response.status(401).json({ message: "Insufficient role" });
  }
  next();
};

usersRouter.get("/", requireAuth, async (request, response) => {
  try {
    const users = await User.find({});

    response.json(users);
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem fetching users",
    });
  }
});

usersRouter.post("/", requireAuth, requireAdmin, async (request, response) => {
  try {
    const { username, firstName, lastName } = request.body;

    const hashedPassword = await hashPassword(request.body.password);

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
      return response.status(400).json({ message: "Username already exists" });
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

      return response.json({
        message: "User created!",
        token,
        userInfo,
        expiresAt,
      });
    } else {
      return response.status(400).json({
        message: "There was a problem creating your account",
      });
    }
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem creating your account",
    });
  }
});

usersRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  async (request, response) => {
    try {
      const deletedUser = await User.findOneAndDelete({
        _id: request.params.id,
      });
      response.status(201).json({
        message: "User deleted!",
        deletedUser,
      });
    } catch (error) {
      return response.status(400).json({
        message: "There was a problem deleting the user.",
      });
    }
  },
);

module.exports = usersRouter;
