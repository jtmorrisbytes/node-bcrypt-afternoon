const express = require("express");
const Router = express.Router;

const auth = Router();

module.exports = {
  basePath: "/auth",
  router: auth,
};
