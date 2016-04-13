var goalController = require('../goals/goalController');
var userController = require('../users/userController');
var postController = require('../posts/postController');
var helpers = require('./helper');

module.exports = function(app, express) {

app.route('/api/goals/:user_id')
  .get(goalController.getGoals)
  .post(goalController.addGoal);

app.route('/api/profile/:user_id')
  .get(postController.getProfile)
  .post(postController.updateProfile);

app.route('/api/profile/posts/:user_id')
  .get(postController.getPosts)
  .post(postController.addPost);

app.route('/api/friends/pending/:user_id')
  .get(userController.getFriendRequests)
  .post(userController.acceptFriendRequest);

app.route('/api/main/:user_id')
  .get(userController.getInactiveFriends/*, userController.getFriendsPosts*/);
  // .post(userController.comment);

app.get('/api/friends/:user_id', userController.allFriends);
app.get('/api/friends/requests/:user_id', userController.getRequestedFriends);
app.post('/api/friends/add/:user_id', userController.sendFriendRequest);

app.post('/api/signin/:user_id', userController.addUser);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
app.use(helpers.errorLogger);
app.use(helpers.errorHandler);

};