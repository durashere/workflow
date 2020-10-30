/* eslint-disable no-underscore-dangle */
const tonersLogsRouter = require("express").Router();
const Toner = require("../models/tonerModel");
const TonerLog = require("../models/tonerLogModel");

const { requireAuth, requireAdmin } = require("../util");

tonersLogsRouter.get("/", requireAuth, async (request, response) => {
  try {
    const tonersLogs = await TonerLog.find({});

    const tonersToJson = tonersLogs.map((tonerLog) => tonerLog.toJSON());

    return response.json(tonersToJson);
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem fetching toners logs",
    });
  }
});

tonersLogsRouter.post("/", requireAuth, async (request, response) => {
  try {
    const data = request.body;

    const newTonerLog = new TonerLog(data.toner_log);
    await newTonerLog.save();

    const updatedToner = await Toner.findByIdAndUpdate(
      { _id: data.toner_id },
      { amount: data.toner_amount, $push: { logs: newTonerLog } },
    ).populate("logs");

    return response.status(201).json({
      message: "Toner log created!",
      toner: updatedToner,
    });
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem creating the toner log",
    });
  }
});

module.exports = tonersLogsRouter;
