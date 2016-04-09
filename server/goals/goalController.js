var User = require('../users/userModel.js');

module.exports = {
  allGoals: function(req, res) {
    // TO DO
  },

  newGoal: function(req, res) {
    var goal = req.body.goal;
    var username = req.body.username;
    var dueDate = req.body.dueDate;

    User.findOne({ username: username })
      .then(function(user) {
        user.goals.push({
          goal: goal,
          due_date: dueDate
        });
        return user;
      })
      .then(function(user) {
        user.save();
        res.status(200).send('Goal added');
      });
  }
};
