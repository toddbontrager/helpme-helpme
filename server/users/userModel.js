var mongoose = require('mongoose');
var friends = require('mongoose-friends');
var GoalSchema = require('../goals/goalSchema.js');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  user_Id: { type: String, required: true },
  username: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  goals: [GoalSchema],
  /*
  friends: [{
    added: The date the friendship request was first *created* (NOT accepted
    status: pending/accepted/requested
    _id: ID of friend
  }]
  */
},
{
  timestamps: true
});

UserSchema.plugin(friends({pathName: 'friends'}));
// mongoose-friends automatically adds a friends array defined above

module.exports = mongoose.model('User', UserSchema);