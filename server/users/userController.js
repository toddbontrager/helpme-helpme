var User = require('./userModel');
var Status = require('mongoose-friends').Status;
var helper = require('../config/helper');
var _ = require('lodash');

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
    var auth_id = req.params.user_id;
    var accepted = { 'friends.status': Status.Accepted };

    var InactiveFriends = function(err, friendship, res, next) {
      // friendsArray contains all docs of friends [<doc1>, <doc2>, <doc3> ... ]
      var friendsArray = _.map(friendship, 'friend');

      var LatestPost = [];

      _.forEach(friendsArray, function(friend) {
        var goals = friend.goals;

        var obj = {
          id: friend._id,
          post: []
        };

        // gets the latest post for each existing goal
        _.forEach(goals, function(goal) {
          var lastIndex = goal.posts.length-1;
          var lastPost = goal.posts[lastIndex];

          obj.post.push(lastPost);
        });

        // finds the latest post over all
        obj.post = _.reduce(obj.post, function(prev, next) {
          if (prev.updatedAt > next.updatedAt) {
            return prev;
          } else {
            return next;
          }
        }, []);

        LatestPost.push(obj);
      });

        var top5 = _
          .chain(LatestPost)
          .sortBy('post.updatedAt')
          .drop(LatestPost.length-5)
          .value();

        res.status(200).json(top5);
    };

    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        getFriendship(user._id, accepted, InactiveFriends, res, next);
      });
  },

  // getFriendsPosts: function(req, res, next) {

  // },

  sendFriendRequest: function(req, res, next) {
    var auth_id = req.params.user_id;
    var friend_id = req.body.friend_id;

    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        friendRequest(user._id, friend_id, helper.sendJSON, res, next);
      });
  },

  acceptFriendRequest: function(req, res, next) {
    var auth_id = req.params.user_id;
    var friend_id = req.body.friend_id;

    // reciprocate friend request to approve pending request
    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        friendRequest(user._id, friend_id, helper.sendJSON, res, next);
      });
  },

  allFriends: function(req, res, next) {
    var auth_id = req.params.user_id;
    var accepted = { 'friends.status': Status.Accepted };

    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        getFriendship(user._id, accepted, helper.sendJSON, res, next);
      });

  },

  getFriendRequests: function(req, res, next) {
    var auth_id = req.params.user_id;
    var pending = { 'friends.status': Status.Pending };

    User.findOne({ auth_id: auth_id })
      .then(function(user) {
        getFriendship(user._id, pending, helper.sendJSON, res, next);
      });
  },

  getRequestedFriends: function(req, res, next) {
    var auth_id = req.params.user_id;
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
