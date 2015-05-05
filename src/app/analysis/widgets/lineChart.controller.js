(function(module) {
  'use strict';
  module.controller('LineChartCtrl', function($scope, $timeout, processCallService) {
    self = this;
    $scope.chartConfig = {
      options: {
        chart: {
          zoomType: 'x'
        },
        rangeSelector: {
          enabled: true
        },
        navigator: {
          enabled: true
        }
      },
      series: [{
        id: 1,
        data: []
      }],
      title: {
        text: 'Hello'
      },
      useHighStocks: true
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
          $scope.withData = false;
          $scope.chartConfig.series = [{
            id: 1,
            data: []
          }],

          $timeout(function() {
            self.updateData(data);
            $scope.$apply();
          }, 100);

        });
      $scope.series = [$scope.model.dataSettings.portfolioName];

    });

    this.updateData = function(data) {
      for (var i = 0; i < data.length; i++) {
        var time = new Date(2010, 9, data[i].id).getTime();
        var value = data[i].value;
        $scope.chartConfig.series[0].data.push([time, value]);
      }
      $scope.series = [$scope.model.dataSettings.portfolioName];
      $scope.withData = true;
    };

  });
}(angular.module("analysis")));
