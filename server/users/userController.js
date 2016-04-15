var User = require('./userModel');
var helper = require('../config/helper');
var _ = require('lodash');
var Status = require('mongoose-friends').Status;

// moongoose-friends docs https://www.npmjs.com/package/mongoose-friends
/**
 *
 * @param {String} auth_id - is used to find the current user logged in
 * @param {String} friend_id - is the model _id of the friend being added
 *
 */

var friendRequest = function(auth_id, friend_id, callback, res, next) {
  User.findOne({ auth_id: auth_id })
    .then(function(user) {
      User.findOne({auth_id: friend_id})
        .then(function(friend) {
          User.requestFriend(user._id, friend._id, function(err, friendship) {
            callback(err, friendship, res, next);
          });
      });
    });
};

/**
 *
 * @param {String} auth_id - is used to find the current user logged in
 * @param {Object} status - obj with 'friend.status' key. It can have one of the three values, Status.Pending | Status.Accepted | Status.Requested
 *
 */

var getFriendship = function(auth_id, status, callback, res, next) {
  User.findOne({ auth_id: auth_id })
    .then(function(user) {
      // query friend relationships using status
      User.getFriends(user._id, status, function(err, friendship) {
        callback(err, friendship, res, next);
      });
    });
};

/**
 *
 * @param {Array} userArray - an array of user documents
 * @return {Array} - returns an array of objects containing user id and their latest post
 *
 */

var getLatestPosts = function(userArray) {
  var latestPosts = [];

  _.forEach(userArray, function(user) {
    var goals = user.goals;

    var userObj = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      auth_id: user.auth_id,
      updatedAt: user.updatedAt,
      latestPost: {}
    };

    // finds the last post for each existing goal
    var recentPosts = helper.lastItemProperty(goals, 'posts');
    // finds the latest post over all
    userObj.latestPost = _.maxBy(recentPosts, 'updatedAt');

    latestPosts.push(userObj);
  });

  return latestPosts;
};

var inactiveFriends = function(err, friendship, res, next) {
  /*
   * https://lodash.com/docs#map
   * friendsArray contains all the docs of friends [<doc1>, <doc2>...]
   */
  var friendsArray = _.map(friendship, 'friend');

  var friendsLatestPosts = getLatestPosts(friendsArray);
  /*
   * https://lodash.com/docs#chain
   */
  var mostInactive = function(n) {
    return _
      .chain(friendsLatestPosts)
      .sortBy('latestPost.updatedAt')
      .take(n)
      .value();
  };

  if (err) {
    next(new Error(err));
  } else {
    res.status(200).json(mostInactive(5));
  }
};

var friendsPosts = function(err, friendship, res, next) {
  var friendsArray = _.map(friendship, function(friendship) {
    var friend = friendship.friend;
    var posts = helper.reduceGoalstoPosts(friend.goals);
    return [friend, posts];
  });

  helper.sendJSON(err, friendsArray, res, next);
};

module.exports = {
  getInactiveFriends: function(req, res, next) {
    var auth_id = req.params.user_id;

    getFriendship(auth_id, {'friends.status': Status.Accepted}, inactiveFriends, res, next);
  },

  getFriendsPosts: function(req, res, next) {
    var auth_id = req.params.user_id;

    getFriendship(auth_id, {'friends.status': Status.Accepted}, friendsPosts, res, next);
  },

  sendFriendRequest: function(req, res, next) {
    var auth_id = req.params.user_id;
    var friend_id = req.body.friend_id;

    friendRequest(auth_id, friend_id, helper.sendJSON, res, next);
  },

  acceptFriendRequest: function(req, res, next) {
    var auth_id = req.params.user_id;
    var friend_id = req.body.friend_id;

    // reciprocate friend request to approve pending request
    friendRequest(auth_id, friend_id, helper.sendJSON, res, next);
  },

  allFriends: function(req, res, next) {
    var auth_id = req.params.user_id;

    getFriendship(auth_id, {'friends.status': Status.Accepted}, helper.sendJSON, res, next);
  },

  getFriendRequests: function(req, res, next) {
    var auth_id = req.params.user_id;

    getFriendship(auth_id, {'friends.status': Status.Pending}, helper.sendJSON, res, next);
  },

  getRequestedFriends: function(req, res, next) {
    var auth_id = req.params.user_id;

    getFriendship(auth_id, {'friends.status': Status.Requested}, helper.sendJSON, res, next);
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
          res.sendStatus(201);
        } else {
          console.log('User exists.');
          res.sendStatus(200);
        }
      });
  },
  searchUsers: function(req, res, next) {
    var info = req.body.search;
    var currentUser = req.user.sub;
    // Allows you to case insensitively search db. Provides partial matches too.
    var regex = new RegExp(["^", info].join(""), "i");
    User.find({
      $and: [
        { auth_id: { $ne: currentUser }},
        { $or: [
          { firstname: regex },
          { lastname: regex  },
          { username: regex  },
          { auth_id: info  }
        ]}
      ]})
      .then(function(results) {
        res.status(201).json(results);
        next();
      });
  },
  removeFriend: function(req, res, next) {
    var auth_id = req.params.user_id;
    var friend_id = req.body.friend_id;

    User.findOne({ auth_id: auth_id })
    .then(function(user) {
      User.findOne({ auth_id: friend_id })
      .then(function(friend) {
        User.removeFriend(user._id, friend._id, function(err, results) {
          res.status(201).json(results);
          console.log(results);
          next();
        });
      });
    });
  }
};
