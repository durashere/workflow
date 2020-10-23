/* eslint-disable no-underscore-dangle */
const cmssRouter = require("express").Router();
const Cms = require("../models/cmsModel");

const { requireAuth, requireAdmin } = require("../util");

cmssRouter.get("/", requireAuth, async (request, response) => {
  try {
    const cmss = await Cms.find({});

    const cmssToJson = cmss.map((cms) => cms.toJSON());

    return response.json(cmssToJson);
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem fetching cmss",
    });
  }
});

cmssRouter.post("/", requireAuth, requireAdmin, async (request, response) => {
  try {
    const cms = request.body;

    const newCms = new Cms(cms);
    await newCms.save();

    return response.status(201).json({
      message: "Cms created!",
      cms,
    });
  } catch (error) {
    return response.status(400).json({
      message: "There was a problem creating the cms",
    });
  }
});

module.exports = cmssRouter;
