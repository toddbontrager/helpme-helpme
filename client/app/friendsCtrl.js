var Friends = angular.module('app.friends', []);

Friends.factory('Friend', function($http) {
  var getFriends = function(user_id) {
    return $http({
      method: 'GET',
      url: '/api/friends'
    })
    .then(function(res) {
      return res.data;
    })
  };

  var addFriend = function(friendship) {
    return $http({
      method: 'POST',
      url: '/api/friends/add',
      data: friendship
    })
    .then(function(res) {
      return res.data;
    })
  };

  var removeFriend = function(friendship) {
    return $http({
      method: 'POST',
      url: '/api/friends/remove',
      data: friendship
    })
    .then(function(res) {
      return res.data;
    })
  };

  var answerFriendReq = function(answer) {
    return $http({
      method: 'POST',
      url: '/api/friends/requests',
      data: answer
    })
    .then(function(res) {
      return res.data;
    })
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