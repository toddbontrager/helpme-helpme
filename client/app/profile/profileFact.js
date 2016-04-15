angular
  .module('app.profile')
  .factory('Profile', Profile);

Profile.$inject = ['$http'];

function Profile($http) {
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
    },

    addComment: function(user_id, comment) {
      return $http({
          method: 'POST',
          url: '/api/profile/comment/' + user_id,
          data: comment
        })
        .then(function(res) {
          return res.data;
        });
    }
  };
}
