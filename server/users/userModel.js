var mongoose = require('mongoose');
var Goal = require('../goals/goalModel.js')

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type : String, required: true },
  password: { type: String, required: true },
  name: String,
  goals: [{ type: Schema.Types.ObjectId, ref: 'Goal' }],
  friends: [{ type : Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);