/* eslint-disable no-underscore-dangle */
const tonersLogsRouter = require("express").Router();
const Toner = require("../models/tonerModel");

const { requireAuth, requireAdmin } = require("../util");

// tonersLogsRouter.get("/", requireAuth, async (request, response) => {
//   try {
//     const tonersLogs = await TonerLog.find({});

//     const tonersToJson = tonersLogs.map((tonerLog) => tonerLog.toJSON());

//     return response.json(tonersToJson);
//   } catch (error) {
//     return response.status(400).json({
//       message: "There was a problem fetching toners logs",
//     });
//   }
// });

tonersLogsRouter.post("/", requireAuth, async (request, response) => {
  try {
    const { toner, newTonerLog } = request.body;

    if (toner.amount <= 0) {
      return response
        .status(400)
        .json({ message: "There are no toners this type" });
    }

    const updatedToner = await Toner.findByIdAndUpdate(
      { _id: toner._id },
      {
        amount: toner.amount - 1,
        $push: { logs: newTonerLog },
      },
      { new: true },
    );

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
