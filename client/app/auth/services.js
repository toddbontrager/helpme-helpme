var Service = angular.module('app.services', []);

Service.factory('UserAuth', function($http) {
  return {
    addUserToDB: function(profile) {
      return $http({
          method: 'POST',
          url: '/api/signin/',
          data: profile
        });
    }
  };
});
