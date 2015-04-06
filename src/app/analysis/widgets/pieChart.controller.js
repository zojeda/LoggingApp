(function(module) {
  'use strict';
  module.controller('PieChartCtrl', function($scope) {
    $scope.labels = ["Cat 1", "Cat 2", "Others"];
    $scope.data = [300, 500, 100];
  });
}(angular.module("loggingApp")));
