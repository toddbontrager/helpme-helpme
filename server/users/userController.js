var User = require('./userModel');
var Status = require('mongoose-friends').Status;

module.exports = {
  sendFriendRequest: function(req, res) {
    var friendId = req.body.friendId;
    var userId = req.body.userId;
    var requested = { 'friends.status': Status.Requested };

    User.requestFriend(userId, friendId);

    // TO DO - json not sending but its adding
    User.getFriends(userId, requested, function(err, requestedFriends) {
      res.status(200).json(requestedFriends);
    });
  },

  acceptFriendRequest: function(req, res) {
    var userId = req.body.userId;
    var friendId = req.body.friendId;

  },

  allFriends: function(req, res) {

  },

  getFriendRequests: function(req, res) {
    var pending = { 'friends.status': Status.Pending };
      // TO DO - how to get Id of user logged in
    var userId = req.body.userId;

    User.getFriends(userId, pending, function(err, friendRequests) {
      res.status(200).json(friendRequests);
    });
  },

  getRequestedFriends: function(req, res) {

  }
};
