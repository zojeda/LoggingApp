(function(module) {
  'use strict';
  module.controller('LineChartCtrl', function ($scope) {

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  $scope.$on('analyze', function(event) {
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.data = [
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.series = [$scope.model.dataSettings.portfolioName];
  });
});
}(angular.module("loggingApp")));
