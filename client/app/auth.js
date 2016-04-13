var Auth = angular.module('app.auth', ['auth0']);

Auth.controller('LoginCtrl', function($scope, auth) {
  $scope.auth = auth;
});