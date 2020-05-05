const mongoose = require('mongoose');

const resourceDataSchema = mongoose.Schema({
  dataId: {type: String, required: false},
  resourcesArray: {type: [], required: true},
  lastUpdated: {type: Number, required: true}
});

module.exports = mongoose.model('ResourceData', resourceDataSchema);
