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

    addPost: function(user_id, post) {
      return $http({
          method: 'POST',
          url: '/api/profile/posts/' + user_id,
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
