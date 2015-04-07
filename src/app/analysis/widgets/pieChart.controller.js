(function(module) {
  'use strict';
  module.controller('PieChartCtrl', function($scope, $state, processCallService) {
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
          $scope.inProgress = false;
          $scope.labels = $scope.labels || [];
          $scope.data = $scope.data || [];
          for(var i=0; i<data.length; i++) {
            $scope.labels[data[i].id] = data[i].name;
            $scope.data[data[i].id] = data[i].value;
          }
        });
      // socketio.on('processMessages', function(messages) {
      //   socketio.on(messages.progress, function(progressData) {
      //     $scope.progress = progressData.progress;
      //     $scope.progressMessage = progressData.info;
      //     $scope.inProgress = progressData.progress < 100;
      //     if(!$scope.inProgress) {
      //       $scope.data = [300, 500, 100];
      //     }
      //   });
      //   socketio.emit(messages.start);
      // });
      // socketio.emit('process', {
      //   request: request,
      //   onCompleted: {
      //     stateName: $state.current.name,
      //     stateParams: {
      //       model: $scope.model
      //     }
      //   }
      // });
      // $scope.labels = ["Cat 1", "Cat 2", "Others"];
      // var progressEvent = 'progress_'+request;
      //
      // socketio.on(progressEvent, function(data) {
      // });

    });
  });
}(angular.module("loggingApp")));
