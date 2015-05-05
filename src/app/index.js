'use strict';

angular.module('loggingApp', ['ui.router', 'ui.bootstrap', 'MessageCenterModule', 'btford.socket-io', 'smart-table', 'analysis'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .factory('socketio', function(socketFactory, $location, $log, $window) {
    var notificationsEndpoint = $location.protocol()+'://'+$location.host()+':'+$location.port();
    $log.log(notificationsEndpoint);
    var myIoSocket = '';
    try {
      var socket = io.connect(notificationsEndpoint, {path: '/api/socket.io', query: 'token='+$window.sessionStorage.token} );
      myIoSocket = socketFactory({
          ioSocket: socket
       });

    } catch( e ) {
      $log.log(e);
    }
    return myIoSocket;
  })
  ;
