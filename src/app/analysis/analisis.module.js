(function(module) {
  'use strict';
  module.config(function($stateProvider) {
    $stateProvider
      .state('analysis', {
        url: '/analysis',
        templateUrl: 'app/analysis/analysis.html'
      })
      .state('analysis.simple', {
        url: '/analysis/simple',
        templateUrl: 'app/analysis/simple/simple.html'
      })
      .state('analysis.complex', {
        url: '/analysis/complex',
        templateUrl: 'app/analysis/complex/complex.html',
        params: {
          model: {
            dataSettings: {
              portfolioName: '',
              benchmarkName: '',
              riskModelName: '',
              date: '2015-05-01'
            },
            widgets: []
          }
        }
      });
  });

  module.config(['progressArcDefaultsProvider', function (progressArcDefaultsProvider) {
    progressArcDefaultsProvider
        .setDefault('background', '#aaa')
        .setDefault('size', 300);
  }])
  module.run(['gridsterConfig', function(gridsterConfig) {
    gridsterConfig.rowHeight = 50;
  }]);

}(angular.module("analysis", [
  'ui.router',
  'smart-table', 'highcharts-ng', 'angular-progress-arc', 'gridster'
])));
