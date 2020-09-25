/* eslint-disable no-underscore-dangle */
const tonersRouter = require("express").Router();
const jwt = require("express-jwt");
const Toner = require("../models/tonerModel");

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

tonersRouter.get("/", requireAuth, async (req, res) => {
  try {
    const toners = await Toner.find({});
    res.json(toners.map((toner) => toner.toJSON()));
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

tonersRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { toner } = req.body;

    const newToner = new Toner(toner);
    await newToner.save();
    res.status(201).json({
      message: "Toner created!",
      toner,
    });
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem creating the toner",
    });
  }
});

tonersRouter.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const tonerID = req.body.id;
    const toner = req.body;

    const tonerObject = {
      model: toner.model,
      amount: toner.amount,
    };

    const updatedToner = await Toner.findByIdAndUpdate(tonerID, tonerObject, {
      new: true,
    });

    res.json({ message: "Toner updated!", toner: updatedToner });
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem updating toner",
    });
  }
});

tonersRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const deletedToner = await Toner.findOneAndDelete({
      _id: req.params.id,
      user: req.user.sub,
    });
    res.status(201).json({
      message: "Toner deleted!",
      deletedToner,
    });
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem deleting the toner.",
    });
  }
});

module.exports = tonersRouter;
