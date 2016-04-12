var goalController = require('../goals/goalController.js');
var userController = require('../users/userController.js');
var postController = require('../posts/postController.js');
var helpers = require('./helper.js');
var dotenv = require('dotenv');
var jwt = require('express-jwt');

dotenv.load();
var jwtCheck = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

module.exports = function(app, express) {

/* Note: you need to specify one or more routes or paths that you want to protect, so that only users with the correct JWT will be able to do the request.
app.use('/api/path-you-want-to-protect', jwtCheck);
*/

app.route('/goals')
  .get(goalController.allGoals)
  .post(goalController.addGoal);

app.route('/profile')
  // .get()
  .post(postController.addPost);

app.route('/friends/pending')
  .get(userController.getFriendRequests)
  .post(userController.acceptFriendRequest);

app.get('/friends', userController.allFriends);
app.get('/friends/requests', userController.getRequestedFriends);
app.post('/friends/add', userController.sendFriendRequest);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
app.use(helpers.errorLogger);
app.use(helpers.errorHandler);

};