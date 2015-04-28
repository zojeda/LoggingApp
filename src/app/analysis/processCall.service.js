(function(module) {
  'use strict';

  function ProcessCallService(socketio, $q, $state, messageCenterService) {


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
          console.log('emiting  onAllDataReady' +data.length);
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
      var expectedDataLenght = undefined;
      socketio.on('processMessages', function(messages) {
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
            if(collectedData.length === expectedDataLenght) {
              socketio.removeAllListeners(messages.data_ready);
              socketio.removeAllListeners(messages.data);
              socketio.removeAllListeners(messages.progress);
              deferred.resolve(collectedData);
            }

            if(expectedDataLenght && collectedData.length != expectedDataLenght) {
              socketio.emit(messages.get_data); //FIXME: only take into account missing values
            }

          });
          socketio.on(messages.data_ready, function(dataLength) {
            expectedDataLenght = dataLength;
            if (collectedData.length == expectedDataLenght) {
              socketio.removeAllListeners(messages.data_ready);
              socketio.removeAllListeners(messages.data);
              socketio.removeAllListeners(messages.progress);
              deferred.resolve(collectedData);
            } else {
              socketio.emit(messages.get_data); //FIXME: only take into account missing values
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
}(angular.module("analysis")));
