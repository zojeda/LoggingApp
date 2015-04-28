(function(module) {
  'use strict';

  module.controller('ComplexCtrl', function($scope, $stateParams, $timeout) {
    $scope.model = $stateParams.model;

    $scope.analyze = function() {
      $scope.$broadcast('analyze');
    };

    if ($stateParams.model.dataSettings.portfolioName) {
      $timeout(function() {
        $scope.analyze();
      });
    };
    $scope.addWidget = function(widgetData) {
      var widgetData = {
        template: widgetData.template,
        size: {
          x: widgetData.defaultSize.x,
          y: widgetData.defaultSize.y
        },
        position: {}
      }
      $scope.model.widgets.push(widgetData);
    };

    $scope.palette = [{
      name: "Table",
      template: "app/analysis/widgets/table.html",
      defaultSize: {
        x: 2,
        y: 2
      }
    }, {
      name: "Pie Chart",
      template: "app/analysis/widgets/pieChart.html",
      defaultSize: {
        x: 2,
        y: 2
      }
    }, {
      name: "Line Chart",
      template: "app/analysis/widgets/lineChart.html",
      defaultSize: {
        x: 2,
        y: 1
      }
    }, ];

  });
}(angular.module("analysis")));
