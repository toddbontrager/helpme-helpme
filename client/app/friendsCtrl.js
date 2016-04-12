var Friends = angular.module('app.friends', []);

Friends.factory('Friend', function($http) {
  var searchFriend = function(user_id, input) {
    return $http({
      method: 'POST',
      url: '/api/searchfriend/' + user_id,
      data: searchInfo
    })
  };

  var getFriends = function(user_id) {
    return $http({
      method: 'GET',
      url: '/api/friends/' + user_id
    })
    .then(function(res) {
      return res.data;
    });
  };

  var addFriend = function(user_id, friend_id) {
    return $http({
      method: 'POST',
      url: '/api/friends/add/' + user_id,
      data: friend_id
    })
    .then(function(res) {
      return res.data;
    });
  };

  var removeFriend = function(user_id, friend_id) {
    return $http({
      method: 'POST',
      url: '/api/friends/remove/' + user_id,
      data: friend_id
    })
    .then(function(res) {
      return res.data;
    });
  };

  var answerFriendReq = function(user_id, answer) {
    return $http({
      method: 'POST',
      url: '/api/friends/requests/' + user_id,
      data: answer
    })
    .then(function(res) {
      return res.data;
    });
  };
})

Friends.controller('FriendsController', function($scope, auth) {
  // User profile information from Auth0 db
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

});