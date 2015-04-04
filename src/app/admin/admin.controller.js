'use strict';

angular.module('loggingApp')
  .controller('AdminCtrl', ['$scope', 'logSocket', function($scope, logSocket) {
    $scope.loggedEvents = [];

    logSocket.on('logCollected', function (logData) {
      $scope.loggedEvents.push(logData);
    });

    $scope.init = function() {
      logSocket.emit('collectLogs');
    };
    $scope.init();
  }]);