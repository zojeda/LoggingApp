'use strict';

angular.module('loggingApp')
  .controller('AdminCtrl', ['$scope', 'socketio', function($scope, socketio) {
    $scope.loggedEvents = [];

    socketio.on('logCollected', function (logData) {
      $scope.loggedEvents.unshift(logData);
    });

    $scope.init = function() {
      socketio.emit('collectLogs');
    };
    $scope.init();
  }]);
