/* eslint-disable no-underscore-dangle */
const cmssRouter = require("express").Router();
const jwt = require("express-jwt");
const Cms = require("../models/cmsModel");

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

cmssRouter.get("/", async (request, response) => {
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

cmssRouter.post("/", async (request, response) => {
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
