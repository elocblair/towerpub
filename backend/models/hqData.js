const mongoose = require('mongoose');

const hqDataSchema = mongoose.Schema({
  dataId: {type: String, required: false},
  levelUpEndTime: {type: Number, required: true},
  hqLevel: {type: Number, required: true},
  levelUpInProcess: {type: Boolean, required: true}
});

module.exports = mongoose.model('HqData', hqDataSchema);
