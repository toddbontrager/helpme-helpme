var _ = require('lodash');
var Status = require('mongoose-friends').Status;

module.exports = {
  /**
   *
   * @param {Array} arrayObj - array of objects
   * @param {String} property - property of object that last item is going to be plucked
   * @return {Array} - array containing the last item of every property
   */

  lastItemProperty: function(arrayObj, property) {
    return _.map(arrayObj, function(obj) {
      if (Array.isArray(obj[property])) {
        // take last item of the array
        return _.takeRight(obj[property])[0];
      } else {
        console.error('must be an array');
      }
    });
  },

  reduceGoalstoPosts: function(goals) {
    return goals.reduce(function(memo, goal) {
      return memo.concat(goal.posts);
    }, []);
  },

  sendJSON: function(error, data, res, next) {
    if (error) {
      next(new Error(error));
    } else {
      res.status(200).json(data);
    }
  },

  errorLogger: function (error, req, res, next) {
    // log the error then send it to the next middleware in
    console.error(error.stack);
    next(error);
  },

  errorHandler: function (error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.status(500).send({error: error.message});
  },

  accepted: { 'friends.status': Status.Accepted },
  pending: { 'friends.status': Status.Pending },
  requested: { 'friends.status': Status.Requested }
};