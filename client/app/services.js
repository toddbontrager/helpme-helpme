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

.factory('Profile', function($http) {
  return {
    getProfile: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/profile/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    getPosts: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/profile/posts/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    addPost: function(post) {
      return $http({
          method: 'POST',
          url: '/api/profile/posts/',
          data: post
        })
        .then(function(res) {
          return res.data;
        });
    }
  };
})

.factory('Goals', function($http) {
  return {
    getGoals: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/goals/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    addGoal: function(user_id, goal) {
      return $http({
          method: 'POST',
          url: '/api/goals/' + user_id,
          data: goal
        })
        .then(function(res) {
          return res.data;
        });
    }
  };
});
