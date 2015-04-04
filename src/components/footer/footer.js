'use strict';

angular.module('loggingApp')
  .controller('FooterCtrl', function ($scope, messageCenterService) {
    $scope.messageCenterService = messageCenterService;
  });
