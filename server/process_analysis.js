var encode = require('hashcode').hashCode;
var q = require('q');

var processes = {};

var messages = { in : {
    get_data: 'get_data',
    process: 'process'
  },

  out: {
    analysis_data: 'analysis_data',
    analysis_all_data_ready: 'analysis_all_data_ready',
    analysis_data_progress: 'analysis_data_progress',
    analysis_completed_process_notification: 'analysis_completed_process_notification'
  }
};

module.exports = function(io, socket) {
  socket.on(messages.in.get_data, function(request, slice) {
    var processKey = encode().value(request);
    var slice = slice || {
      start: 0,
      end: undefined
    };
    socket.emit(messages.out.analysis_data, {
      request: request,
      data: processes[processKey].data.slice(slice.start || 0, slice.end)
    });
  });

  socket.on(messages.in.process, function(requestData) {
    process_request(requestData, io, socket)
  });
};

var process_request = function(requestData, io, socket) {
  var request = requestData.request;
  var processKey = encode().value(requestData.request);
  processes[processKey] = processes[processKey] || {};
  socket.join(processKey);


  //send data already calculated
  if (processes[processKey].data) {
    socket.emit(messages.out.analysis_data, {
      request: request,
      data: processes[processKey].data
    });
    if (processes[processKey].progress == 100) {
      socket.emit(messages.out.analysis_all_data_ready, {
        request: request,
        'data_length': processes[processKey].data.length
      });
    }
  } else { // no data calculated with these parameters
    calqData(io, 0, 0, requestData.request, processKey, messages);
  }

  if (requestData.onCompletedRedirect) {
    processes[processKey].onCompletedRedirect = processes[processKey].onCompletedRedirect || {};
    processes[processKey].onCompletedRedirect[socket.userData.user] = requestData.onCompletedRedirect;
  }
};

var calqData = function(io, progress, id, request, processKey, messages) {
  var progressData = {
    progress: progress,
    info: (progress < 50) ? "calculating" : "post processing"
  };
  var data = {
    id: id,
    name: request.name + '_' + progress,
    value: Math.random() * 10
  };
  processes[processKey].progress = progress;
  processes[processKey].data = processes[processKey].data || [];
  processes[processKey].data.push(data);

  io.sockets.in(processKey).emit(messages.out.analysis_data_progress, {
    request: request,
    progressData: progressData
  });
  io.sockets.in(processKey).emit(messages.out.analysis_data, {
    request: request,
    data: [data]
  });
  var nextProgress = progress + 5;
  if (nextProgress <= 100) {
    process.nextTick(function() {
      q.delay(200 + 1000 * Math.random()).then(function() {
        calqData(io, nextProgress, id + 1, request, processKey, messages);
      });
    });
  } else {
    //completePie;
    processes[processKey].progress = 100;
    io.sockets.in(processKey).emit(messages.out.analysis_all_data_ready, {
      request: request,
      'data_length': processes[processKey].data.length
    });
    var redirects = processes[processKey].onCompletedRedirect;
    for (var key in redirects) {
      io.sockets.in(key).emit(messages.out.analysis_completed_process_notification, {
        request: request,
        type: "success",
        onCompletedRedirect: redirects[key]
      });
    }
  };
};
