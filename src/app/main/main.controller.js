'use strict';

angular.module('loggingApp')
  .controller('MainCtrl', ['$scope', 'messageCenterService', 'socketio', '$state', function($scope, messageCenterService, socketio, $state) {
    $scope.logEvent = function() {
      socketio.emit('log', {type: $scope.type, sent: new Date(), data: $scope.message} );
    };
    socketio.on('logged', function (msg) {
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
