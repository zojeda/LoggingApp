(function(module) {
  'use strict';

  function ProcessCallService(socketio, $q, $state, messageCenterService) {
    var messages = {
      out: {
        get_data: 'get_data',
        process: 'process'
      },

      in : {
        analysis_data: 'analysis_data',
        analysis_all_data_ready: 'analysis_all_data_ready',
        analysis_data_progress: 'analysis_data_progress',
        analysis_completed_process_notification: 'analysis_completed_process_notification'
      }
    };

    var listeners = {};

    this.addListener = function(deferred) {
      var key = JSON.stringify(deferred.requestData.request);
      listeners[key] = listeners[key] || [];
      listeners[key].push(deferred);
    };

    socketio.on(messages.in.analysis_data_progress, function(progress) {
      var key = JSON.stringify(progress.request);
      listeners[key].forEach(function(deferred) {
        deferred.notify(progress.progressData);
      });
    });

    socketio.on(messages.in.analysis_data, function(data) {
      var key = JSON.stringify(data.request);
      listeners[key].forEach(function(deferred) {
        deferred.newData(data.data);
      });

    });

    socketio.on(messages.in.analysis_all_data_ready, function(dataReady) {
      var key = JSON.stringify(dataReady.request);
      listeners[key].forEach(function(deferred) {
        deferred.dataReady(dataReady.data_length);
      });
      listeners[key] = [];
    });

    this.process = function(request, completedMessage, scope) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      deferred.collectedData = [];
      deferred.expectedDataLenght = undefined;


      var requestData = {
        request: request,
      };

      if (completedMessage) {
        requestData.onCompletedRedirect = {
          message: completedMessage,
          stateName: $state.current.name,
          stateParams: {
            model: scope.model
          }
        }
      };

      deferred.requestData = requestData;
      this.addListener(deferred);

      deferred.newData = function(data) {
        deferred.notify(data);
        if (data.constructor === Array) {
          for (var i = 0; i < data.length; i++) {
            deferred.collectedData[data[i].id] = data[i];
          }
        }
        if (deferred.collectedData.length === deferred.expectedDataLenght) {
          deferred.resolve(deferred.collectedData);
        }

        if (deferred.expectedDataLenght && deferred.collectedData.length != deferred.expectedDataLenght) {
          socketio.emit(messages.get_data); //FIXME: only take into account missing values
        }

      };

      deferred.dataReady = function(dataLength) {
        deferred.expectedDataLenght = dataLength;
        if (deferred.collectedData.length == deferred.expectedDataLenght) {
          deferred.resolve(deferred.collectedData);
        } else {
          socketio.emit(messages.get_data); //FIXME: only take into account missing values
        }
      };

      promise.onProgress = function(fn) {
        promise.then(null, null, function(progressData) {
          if (progressData.progress) {
            fn(progressData);
          }
        });
        return promise;
      };
      promise.onData = function(fn) {
        promise.then(null, null, function(data) {
          if (data.constructor === Array) {
            fn(data);
          }
        });
        return promise;
      };
      promise.onAllDataReady = function(fn) {
        promise.then(function(data) {
          fn(data);
        });
        return promise;
      };

      socketio.emit('process', requestData);
      return promise;
    }
  }
  module.service('processCallService', ['socketio', '$q', '$state', 'messageCenterService', ProcessCallService]);
}(angular.module("analysis")));
