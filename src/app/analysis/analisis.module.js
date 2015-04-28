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
              riskModelName: ''
            },
            widgets: [
            ]
          }
        }
      });
  });
}(angular.module("analysis", [
    'ui.router', 
    'smart-table', 'angular-progress-arc', 'chart.js', 'gridster'
])));
