const express = require("express");
const Router = express.Router;

const treasure = Router();
const controller = require("../controllers/treasureController");

const authMiddleware = require("../middleware/authmiddleware");

treasure.get("/dragon", controller.dragonTreasure);
treasure.get("/user", authMiddleware.usersOnly, controller.userTreasure);
treasure.post("/user", authMiddleware.usersOnly, controller.addUserTreasure);
treasure.get(
  "/all",
  authMiddleware.usersOnly,
  authMiddleware.adminsOnly,
  controller.getAllTreasure
);
// auth.post("/login", controller.login);
module.exports = {
  basePath: "/treasure",
  router: treasure,
};
