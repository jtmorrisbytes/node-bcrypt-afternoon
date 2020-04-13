const express = require("express");
const Router = express.Router;

const treasure = Router();
const controller = require("../controllers/treasureController");
treasure.get("/dragon", controller.dragonTreasure);
// auth.post("/login", controller.login);
module.exports = {
  basePath: "/treasure",
  router: treasure
};
