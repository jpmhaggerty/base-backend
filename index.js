const axios = require("axios");
const cors = require("cors");
const express = require("express");
const app = express();

const dataURI = "https://api.weather.gov/gridpoints/MLB/56,69/forecast";
const dbTable = "weather";
const port = process.env.PORT || 3000;
let dataFeed = null;
let period = 10000;
let interval = null;

const connection = require("./knexfile")["development"];
const knex = require("knex")(connection);

app.use(cors());
app.use(express.json());
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

const updateDB = () => {
  getDataFeed();
  //push the API data into the database- will need the structure of the API
  //table needs to mimic the API (revise migrate and seed files)
  knex(dbTable)
    .where({ name: "Banana" })
    .update({ name: "BB" })
    .then(() => {
      console.log("Data inserted");
    });
  console.log("Read api");
};

app.get("/data/:isDataOn", (req, res) => {
  dataFeed = null;
  if (req.params.isDataOn === "off") {
    clearInterval(interval);
    interval = null;
  } else if (req.params.isDataOn === "on") {
    interval = setInterval(updateDB, period);
  }
  res.send(interval ? "Data is on" : "Data is off");
  res.end;
});

app.get("/api", (req, res) => {
  knex(dbTable)
    .select("*")
    .then((dataOut) => {
      res.send(dataOut);
      res.end;
    });
});
