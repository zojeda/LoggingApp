'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();

var options = {
  root: __dirname + 'dist/'
};

app.use(express.static('dist'));
app.get('/', function(req, res) {
  res.sendFile('index.html', options);
});
app.get('/api/something', function(req, res) {
  res.send('hello world');
});


app.listen(5000);
