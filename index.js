const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();
const dbTable = process.env.DB_TABLE || "weather";
const environment =
  require("./knexfile")[process.env.NODE_ENV || "development"];
const port = process.env.PORT || 3001;
const knex = require("knex")(environment);

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

let dataFeed = {
  number: 1,
  cloudurl: "https://api.weather.gov/gridpoints/MLB/46,69/forecast",
  cloudperiod: 10000,
  cloudinterval: null,
  lightningurl: "https://api.weather.gov/gridpoints/MLB/51,69/forecast",
  lightningperiod: 10000,
  lightninginterval: null,
  millurl: "https://api.weather.gov/gridpoints/MLB/56,69/forecast",
  millperiod: 10000,
  millinterval: null,
};

const updateTable = (tableName, tableRecord, conflictField) => {
  knex(tableName)
    .insert(tableRecord)
    .onConflict(conflictField)
    .merge()
    .returning("*")
    .then();
};

const getAPIData = (url, tableName, uniqueField) => {
  let arrayParent = "properties";
  let arrayChild = "periods";
  axios
    .get(url)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      } else {
        for (
          let i = 0;
          i < response.data[arrayParent][arrayChild].length;
          i++
        ) {
          updateTable(
            tableName,
            response.data[arrayParent][arrayChild][i],
            uniqueField
          );
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  console.log("Data refreshed");
};

app.put("/data/:source/:action", (req, res) => {
  let uniqueField = "number";
  switch (req.params.source + "/" + req.params.action) {
    case "cloud/on":
    case "lightning/on":
    case "mill/on": {
      dataFeed[req.params.source + "interval"] = setInterval(
        () =>
          getAPIData(
            dataFeed[req.params.source + "url"],
            req.params.source,
            uniqueField
          ),
        dataFeed[req.params.source + "period"]
      );
      res.send(`${req.params.source} is on`);
      break;
    }
    case "cloud/off":
    case "lightning/off":
    case "mill/off": {
      clearInterval(dataFeed[req.params.source + "interval"]);
      dataFeed[req.params.source + "interval"] = null;
      res.send(`${req.params.source} is off`);
      break;
    }
    case "url/update": {
      updateTable("urls", req.body, "number");
      dataFeed = knex("urls")
        .select("*")
        .where("number", 1)
        .then((result) => res.send(...result));
      break;
    }
    case "rule/update": {
      for (let i = 0; i < res.body.length; i++) {
        updateTable(req.params.source, res.body[i], "name");
      }
      res.send("User data table update");
      console.log("Data refreshed");
      break;
    }
    default: {
      res.send("No action taken.");
    }
  }
});

app.get("/api/:source/:action", (req, res) => {
  switch (req.params.source + "/" + req.params.action) {
    case "cloud/all":
    case "lightning/all":
    case "mill/all": {
      knex(`${req.params.source}`)
        .select("*")
        .then((dataOut) => res.send(dataOut));
      break;
    }
    case "cloud/url":
    case "cloud/period":
    case "lightning/url":
    case "lightning/period":
    case "mill/url":
    case "mill/period": {
      knex("urls")
        .select(req.params.source + req.params.action)
        .where("number", 1)
        .then((result) =>
          res.send(JSON.stringify(...Object.values(...result)))
        );
      break;
    }
    case "all/url": {
      knex("urls")
        .select("*")
        .where("number", 1)
        .then((result) =>
          res.send(JSON.stringify(...Object.values(...result)))
        );
      break;
    }
    case "rule/all": {
      console.log("Send rules");
      res.send({ rules: "rules" });
      break;
    }
    default: {
      knex(`${req.params.source}`)
        .select("*")
        .where("number", `${req.params.action}`)
        .then((dataOut) => res.send(dataOut));
    }
  }
});
