var mongoose = require('mongoose');

var guideSchema = new mongoose.Schema({
  name: String,
  author: String,
  category: [String],
  file: String,
  icon: String,
  description: String,
});

var Guide = mongoose.model('guide', guideSchema);

module.exports = Guide;
