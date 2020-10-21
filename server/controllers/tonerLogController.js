/* eslint-disable no-underscore-dangle */
const tonerLogsRouter = require("express").Router();
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

tonerLogsRouter.get("/", requireAuth, async (request, response) => {
  try {
    const tonerLogs = await TonerLog.find({}).populate("toner");

    return response.json(tonerLogs);
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem fetching toner logs",
    });
  }
});

// tonerLogsRouter.post("/", async (request, response) => {
//   const { body } = request;

//   const toner = await Toner.findById(body.toner_id);

//   console.log(toner);

//   const tonerLog = {
//     log_user: body.log_user,
//     log_time: new Date(),
//   };

//   toner.logs = toner.logs.push(tonerLog);
//   await toner.save();

//   response.json(savedtonerLog);
// });

tonerLogsRouter.put("/", requireAuth, async (request, response) => {
  try {
    const tonerLog = request.body;
    const { toner_id, log_user, log_time } = tonerLog;
    console.log(tonerLog);

    const logToAdd = {
      log_user,
      log_time,
    };

    const updatedLog = await TonerLog.findOneAndUpdate(
      { toner: toner_id },
      {
        $push: {
          logs: logToAdd,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    // const toner = await Toner.findById(updatedLog.toner_id);
    // toner.logs = updatedLog._id;
    // await toner.save();

    return response.json({
      message: "Log updated!",
      tonerLog: updatedLog,
    });
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem updating log",
    });
  }
});

module.exports = tonerLogsRouter;
