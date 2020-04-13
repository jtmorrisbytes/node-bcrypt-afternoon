const express = require("express");
const Router = express.Router;
const fs = require("fs");
const path = require("path");

const routes = Router();

const { API_ROOT } = process.env;
const rootPath = API_ROOT || "/api";

// use this code to dynamically load routers
fs.readdirSync(__dirname).forEach(entry => {
  if (
    !path.join(__dirname, entry).endsWith(path.join(__dirname, "index.js")) &&
    (fs.statSync(path.join(__dirname, entry)).isDirectory() ||
      entry.endsWith("js"))
  ) {
    let module = require(`./${entry}`);
    console.debug(
      `Routes module loading router submodule at '${path.join(
        __dirname,
        entry
      )}' with path ${module.basePath}`
    );
    routes.use(module.basePath, module.router);
  }
});

module.exports = {
  rootPath,
  router: routes
};
