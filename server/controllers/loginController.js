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

    // const passwordCorrect =
    //   user === null ? false : await bcrypt.compare(password, user.passwordHash);

    // if (!(user && passwordCorrect)) {
    //   return response.status(401).json({
    //     error: "invalid username or password",
    //   });
    // }

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
  // const userForToken = {
  //   username: user.username,
  //   id: user._id,
  // };

  // const token = jwt.sign(userForToken, process.env.SECRET);

  // response.status(200).send({
  //   token,
  //   role: user.role,
  //   username: user.username,
  // });
});

module.exports = loginRouter;
