const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/userModel");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("toners", {
    model: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { body } = request;

  if (body.password.length <= 3) {
    return response.status(401).json({ error: "password too short" });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      usergroup: body.usergroup,
      username: body.username,
      passwordHash,
    });

    const savedUser = await user.save();
    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

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
