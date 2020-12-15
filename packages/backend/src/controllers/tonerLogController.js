/* eslint-disable no-underscore-dangle */
const tonersLogsRouter = require("express").Router();
const User = require("../models/userModel");
const Toner = require("../models/tonerModel");

const { requireAuth, requireAdmin } = require("../util");

tonersLogsRouter.post("/", requireAuth, async (request, response) => {
  try {
    const { toner } = request.body;
    const { amountToChange } = request.body;

    if (amountToChange <= 0) {
      if (toner.amount <= 0) {
        return response
          .status(400)
          .json({ message: "There are no toners this type" });
      }
    }

    const calculatedAmount = toner.amount + parseFloat(amountToChange);
    const tonerChangeAmount = calculatedAmount;

    const currentUser = await User.findById(request.user.sub);

    const newTonerLog = {
      user: `${currentUser.firstName} ${currentUser.lastName}`,
      date: new Date(),
      amountBefore: toner.amount,
      amountAfter: tonerChangeAmount,
    };

    const updatedToner = await Toner.findByIdAndUpdate(
      { _id: toner._id },
      {
        amount: tonerChangeAmount,
        $push: { logs: newTonerLog },
      },
      { new: true },
    );

    return response.status(201).json({
      message: `Successfully changed amount of toner: ${toner.code}`,
      toner: updatedToner,
    });
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem creating the toner log",
    });
  }
});

module.exports = tonersLogsRouter;
