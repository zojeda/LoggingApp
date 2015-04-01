'use strict';

angular.module('loggingApp')
  .controller('MainCtrl', ['$scope', 'messageCenterService', 'mySocket', function($scope, messageCenterService) {
    $scope.callEvent = function() {
      // messageCenterService.add('success', 'action completed :) !', {
      //   status: messageCenterService.status.permanent
      // });

      mySocket.emit("message");
    };
  }]);
