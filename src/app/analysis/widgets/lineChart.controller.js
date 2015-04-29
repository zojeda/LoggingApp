(function(module) {
  'use strict';
  module.controller('LineChartCtrl', function($scope, $timeout, processCallService) {
    self = this;

    $scope.onClick = function(points, evt) {
      console.log(points, evt);
    };

    $scope.$on('analyze', function(event) {
      $scope.labels = [];
      $scope.data = [
        []
      ];
      $scope.withData = false;

      var request = {
        name: "line",
        params: $scope.model.dataSettings
      };

      processCallService.process(request)
        .onData(function(data) {
          self.updateData(data);
        })
        .onAllDataReady(function(data) {
          $scope.labels = [];
          $scope.data = [
            []
          ];
          self.updateData(data);
        });
      $scope.series = [$scope.model.dataSettings.portfolioName];

    });

    this.updateData = function(data) {
      for (var i = 0; i < data.length; i++) {
        $scope.labels[data[i].id] = data[i].name;
        $scope.data[0][data[i].id] = data[i].value;
      }
      $scope.series = [$scope.model.dataSettings.portfolioName];
      $scope.withData = true;
    };

  });
}(angular.module("analysis")));
