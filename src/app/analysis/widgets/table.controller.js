(function(module) {
  'use strict';
  module.controller('TableCtrl', function($scope, processCallService) {
    $scope.$on('analyze', function(event) {

      $scope.tableEntries = [];

      var request = {
        name: "table",
        params: $scope.model.dataSettings
      };

      processCallService.process(request)
        .onData(function(data) {
          for (var i = 0; i < data.length; i++) {
            $scope.tableEntries[data[i].id] = data[i];
          }
        });
    });

  });
}(angular.module("loggingApp")));
