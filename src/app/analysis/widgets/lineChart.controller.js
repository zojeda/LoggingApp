(function(module) {
  'use strict';
  module.controller('LineChartCtrl', function($scope, processCallService) {

    $scope.onClick = function(points, evt) {
      console.log(points, evt);
    };

    $scope.$on('analyze', function(event) {
      $scope.labels = [];
      $scope.data = [
        []
      ];

      var request = {
        name: "line",
        params: $scope.model.dataSettings
      };

      processCallService.process(request)
        .onData(function(data) {
          for (var i = 0; i < data.length; i++) {
            $scope.labels[data[i].id] = data[i].name;
            $scope.data[0][data[i].id] = data[i].value;
          }
        });
      $scope.series = [$scope.model.dataSettings.portfolioName];

    });
  });
}(angular.module("loggingApp")));
