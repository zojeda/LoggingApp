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
            widgets: [{
              name: 'app/analysis/widgets/table.html',
              size: {
                x: 2,
                y: 1
              },
              position: {
                col: 0,
                row: 0
              }
            }, {
              name: 'app/analysis/widgets/pieChart.html',
              size: {
                x: 2,
                y: 2
              },
              position: {
                col: 2,
                row: 0
              }
            }, {
              name: 'app/analysis/widgets/lineChart.html',
              size: {
                x: 2,
                y: 1
              },
              position: {
                col: 0,
                row: 1
              },
              params : {
                portfolioName: '',
                benchmarkName: '',
                riskModelName: '',
                date: '2015-05-01'
              }
            }]
          }
        }
      });
  });
}(angular.module("analysis", [
  'ui.router',
  'smart-table', 'angular-progress-arc', 'chart.js', 'gridster'
])));
