'use strict';

angular.module('loggingApp')
  .controller('ComplexCtrl', function($scope, $state, $stateParams, messageCenterService) {
    $scope.model = $stateParams.model;

    $scope.analyze = function() {
      var msg = {
        type: "success",
        data: "try",
        return: {
          stateName: $state.current.name,
          stateParams: {
            model: $scope.model
          }
        }
      };
      messageCenterService.add(msg.type, msg.data, {
        status: messageCenterService.status.permanent,
        html: true,
        addons: {
          go: function() {
            $state.go("home");
            $state.go(msg.return.stateName, msg.return.stateParams);
          }
        }
      });
    }
  });
