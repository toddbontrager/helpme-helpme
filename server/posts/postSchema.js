var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  post: { type: String, required: true }
},
{
  timestamps: true
});

module.exports = PostSchema;