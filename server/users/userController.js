var User = require('./userModel');
var Status = require('mongoose-friends').Status;

// moongoose-friends docs https://www.npmjs.com/package/mongoose-friends
var friendRequest = function(userSendingRequest, friendBeingAdded, res, next) {
  User.requestFriend(userSendingRequest, friendBeingAdded, function(err, friendship) {
    if (err) {
      next(new Error(err));
    } else {
      res.status(200).json(friendship);
    }
  });
};

var getFriendship = function(userId, status, res, next) {
  User.getFriends(userId, status, function(err, friendship) {
    if (err) {
      next(new Error(err));
    } else {
      res.status(200).json(friendship);
    }
  });
};

module.exports = {
  sendFriendRequest: function(req, res, next) {
    var userId = req.body.userId;
    var friendId = req.body.friendId;
    friendRequest(userId, friendId, res, next);
  },

  acceptFriendRequest: function(req, res, next) {

  },

  allFriends: function(req, res, next) {

  },

  getFriendRequests: function(req, res, next) {
    // TO DO - how to get Id of user logged in
    var userId = req.body.userId;
    var pending = { 'friends.status': Status.Pending };

    getFriendship(userId, pending, res, next);
  },

  getRequestedFriends: function(req, res, next) {

  }
};
