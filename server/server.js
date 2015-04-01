'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();

var http = require('http').Server(app);
var io = require('socket.io')(http);


require('./oauth')(app);
var options = {
  root: __dirname + 'dist/'
};

app.use(express.static('dist'));
app.get('/', function(req, res) {
  res.sendFile('index.html', options);
});


app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", "false");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });

io.on('connection', function(socket){
  socket.on('message', function(msg){
    console.log(msg);
    io.emit('response', msg);
  });
});


app.listen(5000);
