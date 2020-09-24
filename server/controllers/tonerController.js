/* eslint-disable no-underscore-dangle */
const tonersRouter = require("express").Router();
const Toner = require("../models/tonerModel");
const User = require("../models/userModel");

tonersRouter.get("/", async (request, response) => {
  if (!request.token || !request.token.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  try {
    const toners = await Toner.find({});
    // .populate("user", {
    //   username: 1,
    //   name: 1,
    // });
    response.json(toners.map((toner) => toner.toJSON()));
  } catch (exception) {
    next(exception);
  }
});

tonersRouter.post("/", async (request, response, next) => {
  const { body } = request;

  if (request.body.model === undefined) {
    response.status(400).end();
  }

  if (!request.token || !request.token.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  try {
    const user = await User.findById(request.token.id);

    const tonerObject = new Toner({
      model: body.model,
      user: user._id,
    });

    const savedToner = await tonerObject.save();
    user.toners = user.toners.concat(savedToner._id);
    await user.save();
    // await savedToner
    //   .populate({ path: "user", select: ["name", "username"] })
    //   .execPopulate();
    response.status(201).json(savedToner.toJSON());
  } catch (exception) {
    next(exception);
  }
});

tonersRouter.put("/:id", async (request, response, next) => {
  const { body } = request;

  if (!request.token || !request.token.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  try {
    const tonerObject = {
      model: body.model,
      amount: body.amount,
    };
    const updatedToner = await Toner.findByIdAndUpdate(
      request.params.id,
      tonerObject,
      {
        new: true,
      },
    );
    // await updatedToner
    //   .populate({ path: "user", select: ["name", "username"] })
    //   .execPopulate();
    response.status(201).json(updatedToner.toJSON());
  } catch (exception) {
    next(exception);
  }
});

tonersRouter.delete("/:id", async (request, response, next) => {
  if (!request.token || !request.token.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  try {
    const toner = await Toner.findById(request.params.id);
    const user = await User.findOne({ username: request.token.username });

    if (toner.user.toString() === user.id.toString()) {
      await Toner.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).end();
    }
  } catch (exception) {
    next(exception);
  }
});

module.exports = tonersRouter;
