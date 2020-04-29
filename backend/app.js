const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  console.log('cole ' + res.getHeaderNames);
  next();
});

app.get("/hq/levels", cors(), (req, res, next) => {
  const levelRequirements = [{
    level: "hq1",
    requirements: ["wood","13","earth","1"],
    timeInSeconds: 5
  },
  {
    level: "hq2",
    requirements: ["wood","20","earth","5"],
    timeInSeconds: 15
  }];
  res.status(200).json({message: "successfully got dummy level path from express!", levelRequirements: levelRequirements});
});

app.get("/resources/array", cors(), (req, res, next) => {
  const resourcesArray = ["wood", "20", "earth", "1", "stone", "0"];
  res.status(200).json({message: "successfully got resources array", resourcesArray: resourcesArray})
})


module.exports = app;
