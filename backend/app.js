const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const HqData = require('./models/hqData');
const ResourceData = require('./models/resourceData');

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
    timeInSeconds: 20
  },
  {
    level: "hq3",
    requirements: ["wood", "1","stone","25"],
    timeInSeconds: 30
  }];
  res.status(200).json({message: "successfully got dummy level path from express!", levelRequirements: levelRequirements});
});

app.get("/hq/status", (req, res, next) => {
  HqData.find().then(documents => {
    res.status(200).json({
      message: "successfully got initial hq data!",
      _id: documents[0]._id,
      hqLevel: +documents[0].hqLevel,
      levelUpEndTime: +documents[0].levelUpEndTime,
      levelUpInProcess: documents[0].levelUpInProcess
    });
  });
});

app.post("/hq/status", (req, res, next) => {
  hqData = new HqData({
    hqLevel: req.body.hqLevel,
    levelUpEndTime: req.body.levelUpEndTime,
    levelUpInProcess: req.body.levelUpInProcess
  });
  hqData.save();
  res.status(201).json({message: "hq data added to db!", _id: hqData._id});
});

app.delete("/hq/status/:id", (req, res, next) => {
  HqData.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: 'deleted response'});
  });
});

app.get("/resources", (req, res, next) => {
  // const resourcesArray = ["wood", "20", "earth", "1", "stone", "0"];
  ResourceData.find().then(documents =>{
    console.log(documents);
    res.status(200).json({
      message: "got resources from db",
      _id: documents[0]._id,
      resourcesArray: documents[0].resourcesArray,
      lastUpdated: documents[0].lastUpdated
    });
  });
  // res.status(200).json({message: "successfully got resources array", resourcesArray: resourcesArray});
});

app.post("/resources", (req, res, next) => {
  resourceData = new ResourceData({
    resourcesArray: req.body.resourcesArray,
    lastUpdated: req.body.lastUpdated
  });
  resourceData.save();
  res.status(201).json({message: "resource data added to db!", _id: resourceData._id});
});

app.delete("/resources/:id", (req, res, next) => {
  ResourceData.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "old resource count deleted"});
  });
});


module.exports = app;
