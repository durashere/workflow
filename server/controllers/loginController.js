/* eslint-disable no-underscore-dangle */
const jwtDecode = require("jwt-decode");
const loginRouter = require("express").Router();
const User = require("../models/userModel");

const { createToken, verifyPassword } = require("../util");

loginRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).lean();

    if (!user) {
      return res.status(403).json({
        message: "Wrong username or password.",
      });
    }
    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const { password, ...rest } = user;
      const userInfo = Object.assign({}, { ...rest });

      const token = createToken(userInfo);

      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.json({
        message: "Authentication successful!",
        token,
        userInfo,
        expiresAt,
      });
    } else {
      res.status(403).json({
        message: "Wrong username or password.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Something went wrong." });
  }
});

module.exports = loginRouter;
