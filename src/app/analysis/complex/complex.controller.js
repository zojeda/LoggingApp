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
      var newWidget = {
        name: widgetData.name,
        template: widgetData.template,
        settingsTemplate: widgetData.settingsTemplate,
        size: {
          x: widgetData.defaultSize.x,
          y: widgetData.defaultSize.y
        },
        position: {}
      }
      $scope.model.widgets.push(newWidget);
    };

    $scope.palette = [{
      name: "Table",
      template: "app/analysis/widgets/table.html",
      settingsTemplate: "app/analysis/widgets/table_settings.html",
      icon: "app/analysis/widgets/table_icon.png",
      defaultSize: {
        x: 2,
        y: 8
      }
    }, {
      name: "Pie Chart",
      template: "app/analysis/widgets/pieChart.html",
      settingsTemplate:"app/analysis/widgets/pieChart_settings.html",
      icon: "app/analysis/widgets/pie_chart.png",
      defaultSize: {
        x: 2,
        y: 6
      }
    }, {
      name: "Line Chart",
      template: "app/analysis/widgets/lineChart.html",
      settingsTemplate:"app/analysis/widgets/lineChart_settings.html",
      icon: "app/analysis/widgets/line_chart.png",
      defaultSize: {
        x: 2,
        y: 6
      }
    }, ];

  });
}(angular.module("analysis")));
