require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const morgan = require("morgan");
const app = express();
const massive = require("massive");
let {
  SERVER_HOST,
  SERVER_PORT,
  DATABASE_URL,
  NODE_ENV,
  SESSION_SECRET,
} = process.env;

SERVER_HOST = SERVER_HOST || "127.0.0.1";

// if publishing client and server together,
// make sure to include an app.use

if (process.NODE_ENV === "production") {
  SERVER_PORT = SERVER_PORT || 80;
  app.use(morgan("tiny"));
} else {
  SERVER_PORT = SERVER_PORT || 3001;
  app.use(morgan("dev"));
}
console.debug("using express.json as json parser");
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
  })
);
console.debug("loading routes...");
const routes = require("./routes");
console.debug("Routes module done loading, with result:", routes);
app.use(routes.rootPath, routes.router);

if (/^test/.test(NODE_ENV)) {
  module.exports = app;
} else {
  console.log("setup complete... attempting to connect to the database...");
  if (!DATABASE_URL) {
    console.error(
      "ERROR!: DATABASE_URL Must be in envorionment variables... exiting."
    );
    process.exit(-1);
  }
  let DbCreds = /^postgres:\/\/([A-Za-z0-9]+)\:([0-9A-Za-z]+)@([A-Za-z0-9\.\-]+):(\d+)\/([a-zA-Z0-9]+)/.exec(
    DATABASE_URL
  );

  massive({
    user: DbCreds[1],
    password: DbCreds[2],
    host: DbCreds[3],
    port: DbCreds[4],
    database: DbCreds[5],
    ssl: {
      mode: "require",
      rejectUnauthorized: false,
    },
  })
    .then((db) => {
      app.set("db", db);
      console.log("Database connected! attempting to start server..");
      app.listen(SERVER_PORT, SERVER_HOST, () => {
        console.log(
          `SERVER LISTENING on http://${SERVER_HOST}:${SERVER_PORT}/`
        );
      });
    })
    .catch((err) => {
      console.error("Database connection failed!", err);
    });
}
