'use strict';

angular.module('loggingApp', ['ui.router', 'ui.bootstrap', 'MessageCenterModule', 'btford.socket-io'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .factory('logSocket', function(socketFactory, $location, $log, $window) {
    var notificationsEndpoint = $location.protocol()+'://'+$location.host()+':'+$location.port();
    $log.log(notificationsEndpoint);
    var myIoSocket = "";
    try {
      myIoSocket = io.connect(notificationsEndpoint, {path: '/api/socket.io', query: 'token='+$window.sessionStorage.token} );
      var logSocket = socketFactory({
          ioSocket: myIoSocket
       });

    } catch( e ) {
      $log.log(e);
    }
    return logSocket;
  });
