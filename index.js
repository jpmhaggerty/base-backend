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

let dataUrlMill = "https://api.weather.gov/gridpoints/MLB/46,69/forecast";
let periodMill = 10000;
let mill = null;

let dataUrlCloud = "https://api.weather.gov/gridpoints/MLB/51,69/forecast";
let periodCloud = 10000;
let cloud = null;

let dataUrlLightning = "https://api.weather.gov/gridpoints/MLB/56,69/forecast";
let periodLightning = 10000;
let lightning = null;

// const getDataFeed = (url) => {
//   axios
//     .get(url)
//     .then((response) => {
//       if (response.status >= 400) {
//         dataFeed = null;
//         throw new Error("Bad response from server");
//       }
//       dataFeed = response.data;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// const loadDataFeed = (dataFeed, tableName, uniqueField = "number") => {
//   for (let i = 0; i < dataFeed.length; i++) {
//     knex(tableName)
//       .insert(dataFeed[i])
//       .onConflict(uniqueField)
//       .merge()
//       .returning("*")
//       .then(() => {
//         console.log("Data refreshed");
//       });
//   }
// };

// const auditDataFeed = () => {
//   console.log("Drop records outside time bounds");
// };

const updateDB = (url, tableName, uniqueField = "number") => {
  axios
    .get(url)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      for (let i = 0; i < response.data.properties.periods.length; i++) {
        knex(tableName)
          .insert(response.data.properties.periods[i])
          .onConflict(uniqueField)
          .merge()
          .returning("*")
          .then(() => {
            console.log("Data refreshed");
            console.log("Drop records outside time bounds");
          });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

//change to put
app.get("/data/:source/:switch", (req, res) => {
  if (req.params.switch === "off") {
    clearInterval(`${req.params.source}`);
    if (`${req.params.source}` === "lightning") {
      lightning = null;
    } else if (`${req.params.source}` === "cloud") {
      cloud = null;
    } else if (`${req.params.source}` === "mill") {
      mill = null;
    }
  }

  if (req.params.switch === "on") {
    if (`${req.params.source}` === "lightning") {
      lightning = setInterval(
        updateDB(dataUrl, "lightning", "number"),
        updatePeriod
      );
    } else if (`${req.params.source}` === "cloud") {
      cloud = setInterval(updateDB(dataUrl, "cloud", "number"), updatePeriod);
    } else if (`${req.params.source}` === "mill") {
      mill = setInterval(updateDB(dataUrl, "mill", "number"), updatePeriod);
    }
  }

  if (req.params.switch === "update") {
    //update params
  }

  res.send(`${req.params.source}` ? "Data is on" : "Data is off");
  res.end;
});

app.get("/api/:source/:number", (req, res) => {
  knex(`${req.params.source}`)
    .select("*")
    .where({ number: req.params.number })
    .then((dataOut) => res.send(dataOut));
});

app.get("/api/:source", (req, res) => {
  knex(`${req.params.source}`)
    .select("*")
    .then((dataOut) => res.send(dataOut));
});
