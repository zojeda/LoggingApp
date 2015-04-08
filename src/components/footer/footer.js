'use strict';

angular.module('loggingApp')
  .controller('FooterCtrl', function ($scope, messageCenterService, socketio, $state) {

    socketio.on('completed_process', function(completedData) {
      console.log('complete_process');
      var redirection = completedData.onCompletedRedirect;

      messageCenterService.add(completedData.type, redirection.message, {
        status: messageCenterService.status.permanent,
        html: true,
        addons: {
          go: function() {
            $state.go("home");
            $state.go(redirection.stateName, redirection.stateParams);
          }
        }
      });
    });

    $scope.mcMessages = messageCenterService.mcMessages;
  });
