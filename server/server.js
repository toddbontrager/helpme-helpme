var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var app = express();

mongoose.connect('mongodb://localhost/helpme');


// files to serve
// app.use(express.static());


// get data from a POST
// app.use(bodyParser.  );

var port = process.env.PORT || 8080;


app.listen(port);
console.log('Server is running on' + port);

module.exports = app;
