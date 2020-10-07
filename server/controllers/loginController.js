/* eslint-disable no-underscore-dangle */
const jwtDecode = require("jwt-decode");
const loginRouter = require("express").Router();
const User = require("../models/userModel");

const { createToken, verifyPassword } = require("../util");

loginRouter.post("/", async (request, response) => {
  try {
    const { username, password } = request.body;

    const user = await User.findOne({ username }).lean();

    if (!user) {
      return response.status(403).json({
        message: "Wrong username or password.",
      });
    }
    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const { ...rest } = user;
      const userInfo = { ...rest };

      const token = createToken(userInfo);

      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      return response.json({
        message: "Authentication successful!",
        token,
        userInfo,
        expiresAt,
      });
    }

    return response.status(403).json({
      message: "Wrong username or password.",
    });
  } catch (error) {
    return response.status(400).json({ message: "Something went wrong." });
  }
});

module.exports = loginRouter;
