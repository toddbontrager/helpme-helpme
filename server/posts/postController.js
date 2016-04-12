var User = require('../users/userModel');

module.exports = {
  getProfile: function(req, res) {
    var user_id = req.body.user_id;

    User.findOne({ user_id: user_id })
      .then(function(user) {
        res.status(200).json(user);
      });
  },

  addPost: function(req, res) {
    var post = req.body.post;
    var goalId = req.body.goalId;
    var user_id = req.body.user_id;

    User.findOne({ user_id: user_id })
      // find goal by id and add new post to goal
      .then(function(user) {
        var goal = user.goals.id(goalId);

        goal.posts.push({ post: post });

        return user;
      })
      .then(function(user) {
        user.save();
        res.status(201).json(user.goals.id(goalId));
      });
  }
};
