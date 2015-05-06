(function(module) {
  'use strict';
  module.controller('PieChartCtrl', function($scope, $state, $timeout, processCallService) {
    $scope.chartWidth = $scope.widgetFullWidth-60,
    $scope.chartConfig = {
      options: {
        chart: {
          width:  $scope.widgetUI.contentWidth-10,
          height: $scope.widgetUI.contentHeight-15,
          type: 'pie'
        }
      },
      series: [{ data: [] }],
      title: {
        text: undefined
      },
      loading: false
    };

    $scope.$on('widgetResize', function() {
      $scope.chartConfig.options.chart.width = $scope.widgetUI.contentWidth-10;
      $scope.chartConfig.options.chart.height = $scope.widgetUI.contentHeight-15;
    });

    $scope.$on('analyze', function(event) {
      $scope.progress = 0;
      var request = {
        name: "pie",
        params: $scope.model.dataSettings
      };

      $scope.inProgress = true;
      processCallService.process(request, 'your <strong>Pie Chart</strong><br/>data is ready', $scope)
        .onProgress(function(progressData) {
          $scope.progress = progressData.progress;
          $scope.progressMessage = progressData.info;
        })
        .onAllDataReady(function(data) {
          $scope.chartConfig.series = [{data: []}];
          $timeout(function() {
            $scope.inProgress = false;
            for (var i = 0; i < data.length; i++) {
              $scope.chartConfig.series[0].data[i] = [data[i].name, data[i].value]
            }
            $scope.$apply();
          }, 100);
        });
    });
  });
}(angular.module("analysis")));
