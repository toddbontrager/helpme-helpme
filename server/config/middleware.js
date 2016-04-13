var morgan = require('morgan');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var jwt = require('express-jwt');

/* Note: you need to specify one or more routes or paths that you want to protect, so that only users with the correct JWT will be able to do the request.
app.use('/api/path-you-want-to-protect', jwtCheck);
*/

// dotenv.load();
var jwtCheck = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

module.exports = function (app, express) {
  app.use(morgan('dev'));
  app.use('/api/*', jwtCheck);
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
};