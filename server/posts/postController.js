var User = require('../users/userModel');

var reduceGoalstoPosts = function(goals) {
  return goals.reduce(function(memo, goal) {
    memo.concat(goal.posts);
    return memo;
  }, []);
};

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
          posts: reduceGoalstoPosts(user.goals)
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
          goalTitle: goal.title
        });
        user.save();
        res.status(201).json(user.goals.id(goalId));
      });
  }
};
