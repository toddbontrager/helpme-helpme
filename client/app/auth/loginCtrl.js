angular
  .module('app.auth', ['auth0'])
  .controller('LoginController', LoginController);

LoginController.$inject = ['$scope', 'auth'];

// Part of Auth0 basic login setup
function LoginController($scope, auth) {
  $scope.auth = auth;
}