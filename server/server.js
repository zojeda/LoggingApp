'use strict';

// simple express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
  path: '/api/socket.io'
});


var logEntries = {};

require('./oauth')(app);
var memorystore = require('./memorystore');
var options = {
  root: __dirname + 'dist/'
};

app.use(express.static('dist'));
app.get('/', function(req, res) {
  res.sendFile('index.html', options);
});


io.use(function(socket, next){
  memorystore.verify(socket.handshake.query.token, function(error, decode){
    if(error)  {
      return next(new Error('Authentication error'));
    } else {
      return next();
    }
  });
});

var logs = io//.of('/log')
  .on('connection', function(socket) {
    //creating a room for this username
    socket.username = memorystore.decode(socket.handshake.query.token).user;
    socket.join(socket.username);
    var entries = logEntries[socket.username] || [];
    logEntries[socket.username] = entries;
    entries.forEach(function (data) {
      io.sockets.in(socket.id).emit('logged', data);
    })
    socket.on('log', function(data) {
      entries.push(data);
      io.sockets.in(socket.username).emit('logged', data);
    });
  });

server.listen(5000);
