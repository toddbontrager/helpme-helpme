var goalController = require('../goals/goalController.js');
var userController = require('../users/userController.js');
var postController = require('../posts/postController.js');
var helpers = require('./helper.js');

module.exports = function(app, express) {

app.route('/goals')
  .get(goalController.allGoals)
  .post(goalController.addGoal);

app.route('/profile')
  // .get()
  .post(postController.addPost);
  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

};