(function(module) {
  'use strict';
  module.controller('TableCtrl', function ($scope) {
    $scope.$on('analyze', function(event) {
      $scope.tableEntries = [
        {name: "val1", value: 10},
        {name: "val2", value: 15},
        {name: "val3", value: 3},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
        {name: "val4", value: 7},
      ];
    });

});
}(angular.module("loggingApp")));
