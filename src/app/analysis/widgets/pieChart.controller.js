(function(module) {
  'use strict';
  module.controller('PieChartCtrl', function($scope, $state, $timeout, processCallService) {
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
        .onAllDataReady(function(data){
          $timeout(function() {
            $scope.inProgress = false;
            $scope.labels = $scope.labels || [];
            $scope.data = $scope.data || [];
            for(var i=0; i<data.length; i++) {
              $scope.labels[data[i].id] = data[i].name;
              $scope.data[data[i].id] = data[i].value;
            }
            $scope.$apply();
          }, 100);
        });
    });
  });
}(angular.module("analysis")));
