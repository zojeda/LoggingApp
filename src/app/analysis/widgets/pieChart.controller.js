(function(module) {
  'use strict';
  module.controller('PieChartCtrl', function($scope, $state, socketio) {
    $scope.$on('analyze', function(event) {
      $scope.progress = 0;
      var request = JSON.stringify({
        name: "pie",
        params: $scope.model.dataSettings
      });

      socketio.emit('process', {
        request: request,
        onCompleted: {
          stateName: $state.current.name,
          stateParams: {
            model: $scope.model
          }
        }
      });
      $scope.labels = ["Cat 1", "Cat 2", "Others"];
      var progressEvent = 'progress';

      socketio.on(progressEvent, function(data) {
        $scope.progress = data.progress;
        $scope.progressMessage = data.info;
        $scope.inProgress = data.progress < 100;
        if(!$scope.inProgress) {
          $scope.data = [300, 500, 100];
        }
      });

    });
  });
}(angular.module("loggingApp")));
