'use strict';

angular.module('loggingApp')
  .controller('MainCtrl', ['$scope', 'messageCenterService', 'logSocket', '$state', function($scope, messageCenterService, logSocket, $state) {
    $scope.logEvent = function() {
      logSocket.emit('log', {type: $scope.type, sent: new Date(), data: $scope.message, return: $state.current.name} );
    };
    logSocket.on('logged', function (msg) {
      messageCenterService.add(msg.type, msg.data, {
         status: messageCenterService.status.permanent,
         html: true
      });
    });

    $scope.init = function () {
      $scope.type = "info";
    };
    $scope.init();
  }]);
