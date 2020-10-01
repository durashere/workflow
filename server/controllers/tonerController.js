/* eslint-disable no-underscore-dangle */
const tonersRouter = require("express").Router();
const jwt = require("express-jwt");
const Toner = require("../models/tonerModel");

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

tonersRouter.get("/", requireAuth, async (request, response) => {
  try {
    const toners = await Toner.find({});
    response.json(toners.map((toner) => toner.toJSON()));
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem fetching toners",
    });
  }
});

tonersRouter.post("/", requireAuth, requireAdmin, async (request, response) => {
  try {
    const toner = request.body;
    const newToner = new Toner(toner);
    await newToner.save();
    response.status(201).json({
      message: "Toner created!",
      toner,
    });
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem creating the toner",
    });
  }
});

tonersRouter.put(
  "/:id",
  requireAuth,
  requireAdmin,
  async (request, response) => {
    try {
      const tonerID = request.body.id;
      const toner = request.body;

      const tonerObject = {
        model: toner.model,
        amount: toner.amount,
      };

      const updatedToner = await Toner.findByIdAndUpdate(tonerID, tonerObject, {
        new: true,
      });

      response.json({ message: "Toner updated!", toner: updatedToner });
    } catch (error) {
      return response.status(400).json({
        message: "There was a problem updating toner",
      });
    }
  },
);

tonersRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  async (request, response) => {
    try {
      const deletedToner = await Toner.findOneAndDelete({
        _id: request.params.id,
      });
      response.status(201).json({
        message: `${deletedToner.model} deleted!`,
        deletedToner,
      });
    } catch (error) {
      return response.status(400).json({
        message: "There was a problem deleting the toner.",
      });
    }
  },
);

module.exports = tonersRouter;
