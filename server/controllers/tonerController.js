/* eslint-disable no-underscore-dangle */
const tonersRouter = require("express").Router();
const jwt = require("express-jwt");
const Toner = require("../models/tonerModel");
const TonerLog = require("../models/tonerLogModel");

const requireAuth = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

const requireAdmin = (request, response, next) => {
  const { role } = request.user;
  if (role !== "admin") {
    return response.status(401).json({ message: "Insufficient role" });
  }
  return next();
};

tonersRouter.get("/", requireAuth, async (request, response) => {
  try {
    const toners = await Toner.find({}).populate("logs").exec();

    const tonersToJson = toners.map((toner) => toner.toJSON());

    // const tonersToDisplay = tonersToJson.map((toner) => {
    //   const newLogs = toner.logs.map((log) => {
    //     const { log_time, ...rest_logs } = log;
    //     const newTime = log_time.toLocaleString("pl-PL");

    //     return { log_time: newTime, ...rest_logs };
    //   });

    //   toner.logs = newLogs;

    //   return toner;
    // });

    return response.json(tonersToJson);
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

    const newTonerLogs = new TonerLog({ toner: toner._id, logs: [] });
    newToner.logs = newTonerLogs._id;
    newTonerLogs.toner = newToner._id;

    await newToner.save();
    await newTonerLogs.save();

    return response.status(201).json({
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
      const toner = request.body;

      const updatedToner = await Toner.findByIdAndUpdate(toner._id, toner, {
        new: true,
      });

      return response.json({
        message: "Toner updated!",
        toner: updatedToner,
      });
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
        id: request.params._id,
      });
      return response.status(201).json({
        message: `${deletedToner.code} deleted!`,
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
