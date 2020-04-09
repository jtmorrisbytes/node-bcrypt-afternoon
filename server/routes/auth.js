const express = require("express");
const Router = express.Router;

const auth = Router();
const controller = require("../controllers/authenticationController");
auth.post("/register", controller.register);
module.exports = {
  basePath: "/auth",
  router: auth,
};