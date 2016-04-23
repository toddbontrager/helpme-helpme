var goalController = require('../goals/goalController');
var userController = require('../users/userController');
var postController = require('../posts/postController');
var guideController = require('../guides/guideController');
var helpers = require('./helper');
var stripe = require("stripe")("sk_test_3O0QArKqo23EzBstAG9utxNz");

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

  app.get('/api/friends/:user_id', userController.allFriends);
  app.get('/api/friends/requests/:user_id', userController.getRequestedFriends);
  app.post('/api/friends/add/:user_id', userController.sendFriendRequest);
  app.post('/api/friends/remove/:user_id', userController.removeFriend);
  app.post('/api/friends/search/', userController.searchUsers);

  app.get('/api/main/:user_id', userController.getFriendsPosts);
  app.get('/api/main/inactive/:user_id', userController.getInactiveFriends);

  app.post('/api/comment/:user_id', postController.addComment);
  app.post('/api/signin/', userController.addUser);

  app.get('/api/guides/', guideController.getAll);
  app.get('/api/guides/:category', guideController.getByCategory);

  app.post('/api/charge/', function(req, res) {
    var stripeToken = req.body.token;
    var amount = 999;

    stripe.charges.create({
        source: stripeToken,
        currency: 'usd',
        amount: amount,
        description: 'Example charge',
    },
    function(err, charge) {
        if (err) {
          console.log('uh oh');
            res.send(500, err);
        } else {
            res.send(204);
        }
    });
  });

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
