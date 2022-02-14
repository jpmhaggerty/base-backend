const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();
const dbTable = process.env.DB_TABLE || "weather";
const environment =
  require("./knexfile")[process.env.NODE_ENV || "development"];
const port = process.env.PORT || 3000;
const knex = require("knex")(environment);

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const dataUrl = "https://api.weather.gov/gridpoints/MLB/56,69/forecast";
const updatePeriod = 10000;
// let dataFeed = null;
let interval = null;

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

// const loadDataFeed = (dataFeed, tableName, keyField = "number") => {
//   for (let i = 0; i < dataFeed.length; i++) {
//     knex(tableName)
//       .insert(dataFeed[i])
//       .onConflict(keyField)
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

const updateDB = (url, tableName, keyField="number") => {
  axios
    .get(url)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      for (let i = 0; i < response.data.properties.periods.length; i++) {
        knex(tableName)
          .insert(response.data.properties.periods[i])
          .onConflict(keyField)
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

app.get("/data/:dataSwitch", (req, res) => {
  // dataFeed = null;
  if (req.params.dataSwitch === "off") {
    clearInterval(interval);
    interval = null;
  } else if (req.params.dataSwitch === "on") {
    interval = setInterval(updateDB(dataUrl, "weather", "number"), updatePeriod);
  }
  res.send(interval ? "Data is on" : "Data is off");
  res.end;
});

// app.get("/otherdata/:dataSwitch", (req, res) => {
//   dataFeed = null;
//   if (req.params.dataSwitch === "off") {
//     clearInterval(interval);
//     interval = null;
//   } else if (req.params.dataSwitch === "on") {
//     interval = setInterval(updateDB(dataUrl, "weather", "number"), updatePeriod);
//   }
//   res.send(interval ? "Data is on" : "Data is off");
//   res.end;
// });

app.get("/api/:number", (req, res) => {
  knex(dbTable)
    .select("*")
    .where({ number: req.params.number })
    .then((dataOut) => res.send(dataOut));
});

app.get("/api", (req, res) => {
  knex(dbTable)
    .select("*")
    .then((dataOut) => res.send(dataOut));
});
