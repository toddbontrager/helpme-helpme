var Service = angular.module('app.services', []);

Service.factory('Auth', function($http, $state, $window) {
  return {
    signin: function(user) {
      return $http({
          method: 'POST',
          url: '/api/signin',
          data: user
        })
        .then(function(res) {
          // return res.data.token;
        });
    },

    signup: function(user) {
      return $http({
          method: 'POST',
          url: '/api/signup',
          data: user
        })
        .then(function(res) {
          // return res.data.token;
        });
    },

    isAuth: function() {
      // return !!$window.localStorage.getItem('com.helpme');
    },

    signout: function() {
      // $window.localStorage.removeItem('com.helpme');
      $state.go('signin');
    }
  };
})

.factory('Profile', function($http, $state, $window) {
  return {
    getProfile: function(profile) {
      return $http({
          method: 'GET',
          url: '/api/profile',
          data: profile
        })
        .then(function(res) {
          return res.data;
        });
    },

    addPost: function(post) {
      return $http({
          method: 'POST',
          url: '/api/profile/',
          data: post
        })
        .then(function(res) {
          return res.data;
        });
    }
  };
});
