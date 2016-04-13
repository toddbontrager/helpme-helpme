var _ = require('lodash/core');

module.exports = {
  /**
   *
   * @param {Array} arrayObj - array of objects
   * @param {String} property - property of object that will be compared
   * @return {Array} - returns an array containing an obj that has the greatest property value
   */
  greatestProperty: function(arrayObj, property) {
    return _.reduce(arrayObj, function(prev, next) {
      if (prev[property] > next[property]) {
        return prev;
      } else {
        return next;
      }
    }, []);
  },
  /**
   *
   * @param {Array} arrayObj - array of objects
   * @param {String} property - property of object that last item is going to be plucked
   * @return {Array} - array containing the last item of every property
   */

  lastItemProperty: function(arrayObj, property) {
    var lastItems = [];

    _.forEach(arrayObj, function(obj) {
      // check if obj[property] is an array or not
      if (Array.isArray(obj[property])) {
        var lastIndex = obj[property].length-1;
        var lastItem = obj[property][lastIndex];

        lastItems.push(lastItem);
      } else {
        console.error('the ' + property + ' key is not an array');
      }
    });

    return lastItems;
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
};