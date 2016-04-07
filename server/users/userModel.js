var mongoose = require('mongoose');
var Goal = require('../goals/goalModel.js')

var UserSchema = new mongoose.Schema({
  name: { type : String, required: true },
  password: { type: String, required: true },
  goals: [{ type: ObjectId, ref: 'Goal' }],
  friends: [{ type : ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);