var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  post: { type: String, required: true },
  goalTitle: { type: String }
},
{
  timestamps: true
});

module.exports = PostSchema;