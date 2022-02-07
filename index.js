const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();
const dataURI =
  process.env.URI || "https://api.weather.gov/gridpoints/MLB/56,69/forecast";
const dbTable = process.env.DB_TABLE || "weather";
const environment =
  require("./knexfile")[process.env.NODE_ENV || "development"];
const port = process.env.PORT || 3000;
const period = process.env.PERIOD || 10000;

const knex = require("knex")(environment);

let dataFeed = null;
let interval = null;

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const getDataFeed = () => {
  axios
    .get(dataURI)
    .then((response) => {
      if (response.status >= 400) {
        dataFeed = null;
        throw new Error("Bad response from server");
      }
      dataFeed = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const loadDataFeed = () => {
  if (!dataFeed) {
    return;
  }

  for (let i = 0; i < dataFeed.properties.periods.length; i++) {
    knex(dbTable)
      .insert(dataFeed.properties.periods[i])
      .onConflict("number")
      .merge()
      .returning("*")
      .then(() => {
        console.log("Data refreshed");
      });
  }
};

const auditDataFeed = () => {
  console.log("Drop records outside time bounds")
}

app.get("/data/:dataSwitch", (req, res) => {
  dataFeed = null;
  if (req.params.dataSwitch === "off") {
    clearInterval(interval);
    interval = null;
  } else if (req.params.dataSwitch === "on") {
    interval = setInterval(updateDB, period);
  }
  res.send(interval ? "Data is on" : "Data is off");
  res.end;
});

app.get("/api/:number", (req, res) => {
  knex(dbTable)
  .select("*")
  .where({number: req.params.number})
  .then((dataOut) => res.send(dataOut));
});


app.get("/api", (req, res) => {
  knex(dbTable)
  .select("*")
  .then((dataOut) => res.send(dataOut));
});

const updateDB = () => {
  getDataFeed();
  loadDataFeed();
  auditDataFeed();
};