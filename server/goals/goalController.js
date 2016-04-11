var User = require('../users/userModel.js');

module.exports = {
  allGoals: function(req, res) {
    // TO DO - how to find username or id of logged in user - Auth0
    // Coordinate with Aaron
    // 
    // var username = req.body.username;
    
    // User.findOne({ username: username })
    //   .then(function(user) {
    //     res.json(user.goals);
    //   });
  },

  addGoal: function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var username = req.body.username;
    var dueDate = new Date(req.body.dueDate);

    User.findOne({ username: username })
      .then(function(user) {
        user.goals.push({
          title: title,
          description: description,
          due_date: dueDate
        });
        return user;
      })
      .then(function(user) {
        user.save();
        res.status(200).json(user.goals);
      });
  }
};
