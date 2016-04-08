var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  update: { type: String, required: true }
});

module.exports = PostSchema;