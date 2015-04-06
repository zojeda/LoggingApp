(function(module) {
  'use strict';
  module.controller('LineChartCtrl', function ($scope) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = [$scope.model.dataSettings.portfolioName];
  $scope.data = [
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
});
}(angular.module("loggingApp")));
