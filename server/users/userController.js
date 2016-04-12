var User = require('./userModel');
var Status = require('mongoose-friends').Status;
var helper = require('../config/helper');

// moongoose-friends docs https://www.npmjs.com/package/mongoose-friends
/**
 *
 * @param {String} userId - is the model _id of the user logged in and is sending a friend request
 * @param {String} friendId - is the model _id of the friend being added
 *
 */

var friendRequest = function(user_id, friend_id, callback, res, next) {
  User.requestFriend(user_id, friend_id, function(err, friendship) {
    callback(err, friendship, res, next);
  });
};

/**
 *
 * @param {String} user_id - is the model _id of the user logged in
 * @param {Object} status - obj with 'friend.status' key. It can have one of the three values, Status.Pending | Status.Accepted | Status.Requested
 * i.e. { 'friend.status': Status.Accepted }
 * (variable Status is defined in line 2)
 *
 *
 */

var getFriendship = function(user_id, status, callback, res, next) {
  User.getFriends(user_id, status, function(err, friendship) {
    callback(err, friendship, res, next);
  });
};



module.exports = {
  getInactiveFriends: function(req, res, next) {
    var auth_id = req.param('id');
    var accepted = { 'friends.status': Status.Accepted };

    var friendArray = function(err, data, res, next) {

    }

    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        getFriendship(user_id, accepted, friendArray, res, next);
      });
  },

  getFriendsPosts: function(req, res, next) {

  },

  sendFriendRequest: function(req, res, next) {
    var auth_id = req.param('id');
    var friend_id = req.body.friend_id;

    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        friendRequest(user._id, friend_id, helper.sendJSON, res, next);
      });
  },

  acceptFriendRequest: function(req, res, next) {
    var auth_id = req.param('id');
    var friend_id = req.body.friend_id;

    // reciprocate friend request to approve pending request
    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        friendRequest(user._id, friend_id, helper.sendJSON, res, next);
      });
  },

  allFriends: function(req, res, next) {
    var auth_id = req.param('id');
    var accepted = { 'friends.status': Status.Accepted };

    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        getFriendship(user._id, accepted, helper.sendJSON, res, next);
      });

  },

  getFriendRequests: function(req, res, next) {
    var auth_id = req.param('id');
    var pending = { 'friends.status': Status.Pending };

    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        getFriendship(user._id, pending, helper.sendJSON, res, next);
      });
  },

  getRequestedFriends: function(req, res, next) {
    var auth_id = req.param('id');
    var requested = { 'friends.status': Status.Requested };

    getFriendship(userId, requested, res, next);
  },

  addUser: function(req, res, next) {
    var userInfo = {
      auth_id: req.body.user_id,
      username: req.body.nickname,
      firstname: req.body.given_name,
      lastname: req.body.family_name
    };
    User.findOne({ auth_id: userInfo.auth_id })
      .then(function(user) {
        if (!user) {
          User.create(userInfo);
          res.status(201);
        } else {
          console.log('User exists.');
          next();
        }
      });
  }
};
