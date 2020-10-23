/* eslint-disable no-underscore-dangle */
const jwtDecode = require("jwt-decode");
const usersRouter = require("express").Router();
const User = require("../models/userModel");

const {
  createToken,
  hashPassword,
  requireAuth,
  requireAdmin,
} = require("../util");

usersRouter.get("/", requireAuth, requireAdmin, async (request, response) => {
  try {
    const users = await User.find({});

    return response.json(users);
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem fetching users",
    });
  }
});

usersRouter.post("/", requireAuth, requireAdmin, async (request, response) => {
  try {
    const { username, firstName, lastName, role } = request.body;

    const hashedPassword = await hashPassword(request.body.password);

    const userData = {
      username: username.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      role,
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
    }
    return response.status(400).json({
      message: "There was a problem creating user",
    });
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem creating user",
    });
  }
});

usersRouter.put(
  "/:id",
  requireAuth,
  requireAdmin,
  async (request, response) => {
    try {
      const user = request.body;

      const userObject = {
        ...user,
      };

      const updatedUser = await User.findByIdAndUpdate(user._id, userObject, {
        new: true,
      });

      return response.json({ message: "User updated!", user: updatedUser });
    } catch (error) {
      return response.status(400).json({
        message: "There was a problem updating user",
      });
    }
  },
);

usersRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  async (request, response) => {
    try {
      const deletedUser = await User.findOneAndDelete({
        id: request.params._id,
      });

      return response.status(201).json({
        message: `${`${deletedUser.firstName} ${deletedUser.lastName}`} deleted!`,
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
