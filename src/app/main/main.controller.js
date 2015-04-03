'use strict';

angular.module('loggingApp')
  .controller('MainCtrl', ['$scope', 'messageCenterService', 'logSocket', function($scope, messageCenterService, logSocket) {
    $scope.messagesCount = 0;
    $scope.model = { name : 'my model' };
    $scope.callEvent = function() {
      logSocket.emit('log', {type:'success', data: 'big call aa', model: $scope.model} );
    };
    logSocket.on('logged', function (msg) {
      messageCenterService.add(msg.type, msg.data, {
         status: messageCenterService.status.permanent
      });
      $scope.messagesCount += 1;
    });
  }]);
