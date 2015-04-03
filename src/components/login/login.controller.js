'use strict';

angular.module('loggingApp')
  .controller('LoginController', function($scope, $http, $log, $window, $rootScope) {
    $scope.init = function() {
      if ($window.sessionStorage.token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $window.sessionStorage.token;
        $scope.checkToken();
      } else {
        $scope.isLoggedIn = false;
        $scope.username = undefined;
        $rootScope.userData = {user: '', roles: [] };
      }
    };
    $scope.login = function(username, password) {
      $http({
          method: 'POST',
          url: 'api/oauth/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: 'username=' + username + '&password=' + password + '&grant_type=password&client_id=clientId&client_secret=clientSecret'
        })
        .success(function(data, status, headers, config) {
          $window.sessionStorage.token = data.access_token;
          $log.debug(data);
          $log.info('Welcome ' + $window.sessionStorage.token);
          $http.defaults.headers.common.Authorization = 'Bearer ' + $window.sessionStorage.token;
          $scope.checkToken();
          $window.location.reload();
        })
        .error(function(data, status, headers, config) {
          delete $window.sessionStorage.token;
          $log.error('Error: Invalid user or password');
        });
    };
    $scope.logout = function() {
      delete $window.sessionStorage.token;
      $scope.isLoggedIn = false;
      $scope.username = undefined;
    };

    $scope.checkToken = function() {
      var token = $window.sessionStorage.token;
      if (token) {
        $http.get('api/checkToken')
          .success(function(data, status, headers, config) {
            $scope.username = data.user;
            $scope.isLoggedIn = true;
            $rootScope.userData = {user: data.user, roles: data.roles };
          })
          .error(function(data, status, headers, config) {
            $log.error('error reading data : "' + data + '"');
            $log.log(data);
            $scope.username = undefined;
            $scope.isLoggedIn = false;
            $rootScope.userData = {user: '', roles: [] };
          });
      }
    }
    $scope.init();
  });
