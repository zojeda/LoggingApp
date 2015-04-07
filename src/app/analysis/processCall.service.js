(function(module) {
  'use strict';

  function ProcessCallService(socketio, $q, $state, messageCenterService) {

    socketio.on('completed_process', function(completedData) {
      var redirection = completedData.onCompletedRedirect;

      messageCenterService.add(completedData.type, redirection.message, {
        status: messageCenterService.status.permanent,
        html: true,
        addons: {
          go: function() {
            $state.go("home");
            $state.go(redirection.stateName, redirection.stateParams);
          }
        }
      });
    });

    this.process = function(request, completedMessage, scope) {
      var deferred = $q.defer();
      var promise = deferred.promise;

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
      }
      var collectedData = [];
      socketio.on('processMessages', function(messages) {
        socketio.removeAllListeners('processMessages');
        if(JSON.stringify(messages.request)==JSON.stringify(requestData.request))  {
          socketio.on(messages.progress, function(progressData) {
            deferred.notify(progressData);
          });
          socketio.on(messages.data, function(data) {
            deferred.notify(data);
            if (data.constructor === Array) {
              for (var i = 0; i < data.length; i++) {
                collectedData[data[i].id] = data[i];
              }
            }

          });
          socketio.on(messages.data_ready, function() {
            if (collectedData.length > 0) { //FIXME: take into account missing values
              deferred.resolve(collectedData);
            } else {
              //socketio.emit(messages.get_data);
            }

          });

          socketio.emit(messages.start);
        }
      });


      socketio.emit('process', requestData);
      return promise;
    }
  }
  module.service('processCallService', ['socketio', '$q', '$state', 'messageCenterService', ProcessCallService]);
}(angular.module("loggingApp")));
