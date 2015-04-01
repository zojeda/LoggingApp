'use strict';

angular.module('loggingApp')
  .controller('MainCtrl', ['$scope', 'messageCenterService', function($scope, messageCenterService) {
    $scope.callEvent = function() {
      messageCenterService.add('success', 'action completed :) !', {
        status: messageCenterService.status.permanent
      });
    };
  }]);
