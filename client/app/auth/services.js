angular
  .module('app.services', [])
  .factory('UserAuth', UserAuth);

UserAuth.$inject = ['$http'];

function UserAuth($http) {
  return {
    addUserToDB: function(profile) {
      return $http({
          method: 'POST',
          url: '/api/signin/',
          data: profile
        });
    }
  };
}
