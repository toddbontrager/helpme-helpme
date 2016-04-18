angular
  .module('app.controller', ['auth0'])
  .controller('AppController', AppController);

AppController.$inject = ['$scope', 'auth', '$state', 'store', 'Profile'];

function AppController($scope, auth, $state, store, Profile) {
  $scope.user = {};

  // Retrieves the user's info
  $scope.getName = function(user_id) {
    Profile.getProfile(user_id)
      .then(function(data) {
        $scope.user = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Allows user to logout. Signs them out of Auth0 and redirects them to signin state.
  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $state.go('signin');
  };

// Once auth0 profile info has been set, query our database for user's custom name(s)
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
    $scope.getName(profile.user_id);
    $scope.icon = profile.picture;
  });
}
