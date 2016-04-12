module.exports = {
  
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