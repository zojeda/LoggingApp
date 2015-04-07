'use strict';

angular.module('loggingApp')
  .controller('ComplexCtrl', function($scope, $stateParams, $timeout) {
    $scope.model = $stateParams.model;

    $scope.analyze = function() {
      $scope.$broadcast('analyze');
    };

    if($stateParams.model.dataSettings.portfolioName) {
      $timeout(function() {
        $scope.analyze();
      });
    };

  });
