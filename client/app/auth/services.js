angular
  .module('app.services', [])
  .factory('UserAuth', UserAuth);

// Dependency injection. Done this way for minification purposes.
UserAuth.$inject = ['$http'];

function UserAuth($http) {
  return {
    // POSTs profile info from Auth0 db to create new user on our MongoDB
    addUserToDB: function(profile) {
      return $http({
          method: 'POST',
          url: '/api/signin/',
          data: profile
        });
    }
  };
}
