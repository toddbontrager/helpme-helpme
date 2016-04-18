var mongoose = require('mongoose');
var friends = require('mongoose-friends');
var GoalSchema = require('../goals/goalSchema.js');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  auth_id: { type: String, required: true },
  username: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  goals: [GoalSchema],
  // mongoose-friends automatically adds the friends array below to the Schema
  // friends: [{
  //   added: The date the friendship request was first *created* (NOT accepted
  //   status: pending/accepted/requested
  //   _id: ID of friend
  // }]
},
{
  timestamps: true
});

// connect mongoose-friend plugin to Schema
UserSchema.plugin(friends({pathName: 'friends'}));

module.exports = mongoose.model('User', UserSchema);