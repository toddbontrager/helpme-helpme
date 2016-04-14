var User = require('../users/userModel');
var helper = require('../config/helper');

module.exports = {
  getProfile: function(req, res) {
    var user_id = req.params.user_id;

    User.findOne({ auth_id: user_id })
      .then(function(user) {
        var profile = {
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname
        };
        res.status(200).json(profile);
      });
  },

  updateProfile: function(req, res) {
    // TO-DO: implement updating of profile info
  },

  getPosts: function(req, res) {
    var user_id = req.params.user_id;

    User.findOne({ auth_id: user_id })
      .then(function(user) {
        var data = {
          goals: user.goals,
          posts: helper.reduceGoalstoPosts(user.goals)
        };
        res.status(200).json(data);
      });
  },

  addPost: function(req, res) {
    var post = req.body.post;
    var goalId = req.body.goalId;
    var user_id = req.params.user_id;

    User.findOne({ auth_id: user_id })
      .then(function(user) {
        var goal = user.goals.id(goalId);
        goal.posts.push({
          post: post,
          goalTitle: goal.title,
          goal_id: goal._id
        });
        user.save();
        res.status(201).json(user.goals.id(goalId));
      });
  },

  addComment: function(req, res) {
    // friend_id is the mongoose friend _id NOT authID
    var friend_id = req.body.friend_id;
    var auth_id = req.params.user_id;
    var comment = req.body.comment;
    var goal_id = req.body.goal_id;
    var post_id = req.body.post_id;

    User.findOne({ _id: friend_id })
      .then(function(friend) {
        var friendGoal = friend.goals.id(goal_id);
        var friendPost = friendGoal.posts.id(post_id);
        User.findOne({ auth_id: auth_id })
          .then(function(user) {
            friendPost.comments.push({
              comment: comment,
              commenter_id: user._id
            });
            friend.save();
            res.status(201).json(friendPost);
          });
      });
  }
};
