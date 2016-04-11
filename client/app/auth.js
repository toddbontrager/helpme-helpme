var Auth = angular.module('app.auth', ['auth0']);

// Auth.controller('AuthController', function($scope, $state, $window, Auth) {
//   $scope.user = {};
//   $scope.signin = function() {
//     Auth.signin($scope.user)
//       .then(function(token) {
//         // authentication here:
//         // $window.localStorage.setItem('com.helpme', token);
//         $state.go('/app.main');
//       })
//       .catch(function(error) {
//         console.error(error);
//       });
//   };

//   $scope.signup = function() {
//     Auth.signup($scope.user)
//       .then(function(token) {
//         // authentication here:
//         // $window.localStorage.setItem('com.helpme', token);
//         $state.go('/app.main');
//       })
//       .catch(function(error) {
//         console.error(error);
//       });
//   };
// });
Auth.controller('LoginCtrl', function($scope, auth) {
  $scope.auth = auth;
});