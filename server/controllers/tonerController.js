/* eslint-disable no-underscore-dangle */
const tonersRouter = require("express").Router();
const jwt = require("express-jwt");
const Toner = require("../models/tonerModel");
const User = require("../models/userModel");

const requireAuth = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

const requireAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    console.log("test");
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

    console.log("updatedToner", updatedToner);

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

// tonersRouter.delete("/:id", async (request, response, next) => {
//   if (!request.token || !request.token.id) {
//     return response.status(401).json({ error: "token missing or invalid" });
//   }

//   try {
//     const toner = await Toner.findById(request.params.id);
//     const user = await User.findOne({ username: request.token.username });

//     if (toner.user.toString() === user.id.toString()) {
//       await Toner.findByIdAndRemove(request.params.id);
//       response.status(204).end();
//     } else {
//       response.status(401).end();
//     }
//   } catch (exception) {
//     next(exception);
//   }
// });

module.exports = tonersRouter;
