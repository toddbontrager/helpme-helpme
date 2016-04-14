var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  post: { type: String, required: true },
  goalTitle: { type: String },
  goal_id: { type: Schema.Types.ObjectId },
  comments: [{
    comment: { type: String },
    commenter_id: { type: Schema.Types.ObjectId }
  }]
},
{
  timestamps: true
});

module.exports = PostSchema;