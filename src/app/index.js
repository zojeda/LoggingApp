'use strict';

angular.module('loggingApp', ['ui.router', 'ui.bootstrap', 'MessageCenterModule', 'btford.socket-io', 'smart-table', 'angular-progress-arc', 'chart.js'])
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
  })
  .config(['progressArcDefaultsProvider', function (progressArcDefaultsProvider) {
    progressArcDefaultsProvider
        .setDefault('background', '#aaa')
        .setDefault('size', 300);
  }]);
