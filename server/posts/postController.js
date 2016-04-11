var User = require('../users/userModel');

module.exports = {
  addPost: function(req, res) {
    var post = req.body.post;
    var goalId = req.body.goalId;
    var username = req.body.username;

    User.findOne({ username: username })
      // find goal by id and add new post to goal
      .then(function(user) {
        var goal = user.goals.id(goalId);

        goal.posts.push({ post: post });

        return user;
      })
      .then(function(user) {
        user.save();
        res.status(200).json(user.goals.id(goalId));
      });
  }
};
