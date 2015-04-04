'use strict';

// simple express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
  path: '/api/socket.io'
});


var allLogEntries = [];
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
    socket.userData = memorystore.decode(socket.handshake.query.token);
    socket.join(socket.userData.user);
    allLogEntries.forEach(function (data) {
      if(data.user == socket.userData.user) {
        io.sockets.in(socket.id).emit('logged', data);
      }
    })
    //adding to admins room so we can broadcast all events to that room
    if(socket.userData.roles.indexOf('admin')>=0) {
      socket.join('admins');
      socket.on('collectLogs', function(data) {
        allLogEntries.forEach(function (data) {
          io.sockets.in(socket.id).emit('logCollected', data);
        });
      });
    };

    socket.on('log', function(data) {
      data.received = new Date();
      data.user = socket.userData.user
      allLogEntries.push(data);
      io.sockets.in(socket.userData.user).emit('logged', data);
      io.sockets.in('admins').emit('logCollected', data);
    });

  });

server.listen(5000);
