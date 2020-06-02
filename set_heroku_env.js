#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const package = require("./package.json");

const childProcess = require("child_process");
(function main() {
  //check if logged in
  const herokuAppName = package.herokuAppName;
  if (!herokuAppName) {
    console.log(
      "please set 'herokuAppName' in package.json before using this script"
    );
    process.exit(-1);
  }
  childProcess.exec("heroku auth:token", (err, stdout, stderr) => {
    if (err) {
      console.error("an error was raised", err);
    }
    // this command prints the token to stdout
    if (!stdout) {
      console.error(
        "no login token was returned from heroku auth:token. please log in first"
      );
      process.exit(-2);
    } else if (stderr) {
      if (stderr.includes("not logged in")) {
        console.log("Please login with 'heroku login first'");
      }

      // check the list of apps
      childProcess.exec("heroku apps", (err, stdout, stderr) => {
        // console.log(stdout, "--------------\n", stderr);
        if (!stdout) {
          println("getting the apps list produced no output on stdout");
        }
        let apps = stdout.split("\n").filter((item) => {
          return item.length > 0;
        });
        // remove the first entry, seems to be the header
        apps.splice(0, 1);
        if (apps.includes(herokuAppName)) {
          console.log("found app in list");
          childProcess.exec(
            `heroku config --app "${herokuAppName.trim()}" --shell`,
            (err, stdout, stderr) => {
              let vars = stdout
                .split("\n")
                .filter((item) => item.length > 0)
                .join("\r\n");
              console.log("saving vars to .env");
              fs.writeFileSync(".env", vars, { encoding: "utf-8" });
            }
          );
        } else {
          console.error(
            `the appName '${herokuAppName}' was not found in the list of heroku apps`
          );
        }
      });
    }
  });
})();
