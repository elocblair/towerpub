const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const HqData = require('./models/hqData');

const app = express();

mongoose.connect('mongodb+srv://cole:w1aQVTEF8TCGR9p1@cluster0-cgl2k.mongodb.net/test?retryWrites=true&w=majority')
  .then( () => {
    console.log('connected to db');
  })
  .catch( () => {
    console.log('connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  next();
});

app.get("/hq/levels", (req, res, next) => {
  const levelRequirements = [{
    level: "hq1",
    requirements: ["wood","13","earth","1"],
    timeInSeconds: 5
  },
  {
    level: "hq2",
    requirements: ["wood","20","earth","5"],
    timeInSeconds: 120
  }];
  res.status(200).json({message: "successfully got dummy level path from express!", levelRequirements: levelRequirements});
});

app.get("/hq/initData", (req, res, next) => {
  HqData.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "successfully got initial hq data!",
      _id: documents[0]._id,
      hqLevel: +documents[0].hqLevel,
      levelUpEndTime: +documents[0].levelUpEndTime
    });
  });
});

app.post("/hq/initData", (req, res, next) => {
  hqData = new HqData({
    hqLevel: req.body.hqLevel,
    levelUpEndTime: req.body.levelUpEndTime
  });
  hqData.save()
  res.status(201).json({message: "hq data added to db!"});
});

app.delete("/hq/initData/:id", (req, res, next) => {
  HqData.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'deleted response'});
  });

});

app.get("/resources/array", (req, res, next) => {
  const resourcesArray = ["wood", "20", "earth", "1", "stone", "0"];
  res.status(200).json({message: "successfully got resources array", resourcesArray: resourcesArray})
});

app.post("/resources/array", (req, res, next) => {
  postData = req.body;
  res.status(201).json({message: "resource data added to db!"});
});


module.exports = app;
