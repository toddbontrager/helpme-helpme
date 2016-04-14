angular
  .module('app.auth', ['auth0'])
  .controller('LoginController', LoginController);

LoginController.$inject = ['$scope', 'auth'];

function LoginController($scope, auth) {
  $scope.auth = auth;
}