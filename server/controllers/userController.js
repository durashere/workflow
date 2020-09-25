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
    const { username, firstName, lastName, role } = req.body;

    const hashedPassword = await hashPassword(req.body.password);

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
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User(userData);
    console.log("newUser", newUser);
    const savedUser = await newUser.save();
    console.log("savedUser", savedUser);
    console.log("kek");

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

// usersRouter.post("/", async (request, response, next) => {
//   const { body } = request;

//   if (body.password.length <= 3) {
//     return response.status(401).json({ error: "password too short" });
//   }

//   try {
//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(body.password, saltRounds);

//     const user = new User({
//       role: body.role,
//       username: body.username,
//       firstName: body.firstName,
//       lastName: body.lastName,
//       passwordHash,
//     });

//     const savedUser = await user.save();
//     response.json(savedUser);
//   } catch (exception) {
//     next(exception);
//   }
// });

// tonersRouter.put("/:id", async (request, response, next) => {
//   const { body } = request;

//   try {
//     const tonerObject = {
//       model: body.model,
//       amount: body.amount,
//     };
//     const updatedToner = await Toner.findByIdAndUpdate(
//       request.params.id,
//       tonerObject,
//       {
//         new: true,
//       },
//     );
//     await updatedToner
//       .populate({ path: "user", select: ["name", "username"] })
//       .execPopulate();
//     response.status(201).json(updatedToner.toJSON());
//   } catch (exception) {
//     next(exception);
//   }
// });

usersRouter.delete("/:id", async (request, response, next) => {
  try {
    await User.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
