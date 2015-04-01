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
  .factory('mySocket', function(socketFactory) {
    //var myIoSocket = io.connect('/api/socket');

    // mySocket = socketFactory({
    //   ioSocket: myIoSocket
    // });
    var mySocket = 'something';
    return mySocket;
  });
