'use strict';

// simple express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
  path: '/api/socket.io'
});


var q = require('q');

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


io.use(function(socket, next) {
  memorystore.verify(socket.handshake.query.token, function(error, decode) {
    if (error) {
      return next(new Error('Authentication error'));
    } else {
      return next();
    }
  });
});

var calqPie = function(progress, id, reqName, processKey, messages) {
  var progressData = {
    progress: progress,
    info: (progress < 50) ? "calculating" : "post processing"
  };
  var data = {
    id: id,
    name: reqName+ '_' + progress,
    value: Math.random() * 10
  };
  processes[processKey].progress = progress;
  processes[processKey].data = processes[processKey].data || [];
  processes[processKey].data.push(data);

  io.sockets.in(processKey).emit(messages.progress, progressData);
  io.sockets.in(processKey).emit(messages.data, [data]);
  var nextProgress = progress + 5;
  if (nextProgress <= 100) {
    process.nextTick(function() {
      q.delay(2000+1000*Math.random()).then(function() {
        calqPie(nextProgress, id+1, reqName, processKey, messages);
      });
    });
  } else {
    //completePie;
    processes[processKey].progress = 100;
    io.sockets.in(processKey).emit(messages.data_ready, processes[processKey].data.length);
    var redirects = processes[processKey].onCompletedRedirect;
    for (var key in redirects) {
      console.log('sending completed process to : ' + key);
      io.sockets.in(key).emit('completed_process', {
        type: "success",
        onCompletedRedirect: redirects[key]
      });
    }
  };
};

var encode = require('hashcode').hashCode;
var process_pie = function(requestData, socket) {
  var processKey = encode().value(requestData.request);
  processes[processKey] = processes[processKey] || {};

  if(requestData.onCompletedRedirect) {
    processes[processKey].onCompletedRedirect = processes[processKey].onCompletedRedirect || {};
    processes[processKey].onCompletedRedirect[socket.userData.user]=requestData.onCompletedRedirect;
  }
  var messages = {
    request: requestData.request,
    progress: 'on_progress_' + processKey,
    data: 'on_data_' + processKey,
    completed: 'on_completed_' + processKey,
    data_ready: 'on_data_ready_' + processKey,

    get_data: 'get_data_' + processKey,
    start: 'start_' + processKey
  }
  socket.emit('processMessages', messages);
  socket.join(processKey);
  socket.on(messages.start, function() {
    socket.setMaxListeners(0);
    socket.on(messages.get_data, function(slice) {
      var slice = slice || {start: 0, end: undefined};
      socket.emit(messages.data, processes[processKey].data.slice(slice.start || 0, slice.end));
    });

    //send data already calculated
    if(processes[processKey].data) {
      socket.emit(messages.data, processes[processKey].data);
      if(processes[processKey].progress==100) {
        socket.emit(messages.data_ready, processes[processKey].data.length);
      }
    } else { // no data calculated with these parameters
      calqPie(0, 0, requestData.request.name, processKey, messages);
    }
  });
};

var processes = {};

function handleProcessRequests(socket) {
  socket.on('process', function(requestData) {
    process_pie(requestData, socket);
  });
};

io.sockets.setMaxListeners(0);
io //.of('/log')
  .on('connection', function(socket) {
  //creating a room for this username
  socket.userData = memorystore.decode(socket.handshake.query.token);
  socket.join(socket.userData.user);
  allLogEntries.forEach(function(data) {
      if (data.user == socket.userData.user) {
        io.sockets.in(socket.id).emit('logged', data);
      }
    })
    //adding to admins room so we can broadcast all events to that room
  if (socket.userData.roles.indexOf('admin') >= 0) {
    console.log('adding admin');
    socket.join('admins');
    socket.on('collectLogs', function(data) {
      allLogEntries.forEach(function(data) {
        io.sockets.in(socket.id).emit('logCollected', data);
      });
    });
  };

  handleProcessRequests(socket);
  socket.on('log', function(data) {
    data.received = new Date();
    data.user = socket.userData.user
    allLogEntries.push(data);
    io.sockets.in(socket.userData.user).emit('logged', data);
    io.sockets.in('admins').emit('logCollected', data);
  });

});

server.listen(5000);
