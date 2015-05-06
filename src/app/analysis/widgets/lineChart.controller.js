(function(module) {
  'use strict';
  module.controller('LineChartCtrl', function($scope, $timeout, processCallService) {
    self = this;
    $scope.chartConfig = {
      options: {
        chart: {
          width: $scope.widgetUI.contentWidth,
          height: $scope.widgetUI.contentHeight-10,
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
      useHighStocks: true
    };
    $scope.$on('widgetResize', function() {
      $scope.chartConfig.options.chart.width = $scope.widgetUI.contentWidth-10;
      $scope.chartConfig.options.chart.height = $scope.widgetUI.contentHeight-15;
    });

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
