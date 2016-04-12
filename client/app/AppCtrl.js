var AppCtrl = angular.module('app.controller', ['auth0']);

AppCtrl.controller('AppController', function($scope, auth, $http, $state, store) {
  $scope.auth = auth;
  $scope.profile = auth.profile;

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $state.go('signin');
  };
});