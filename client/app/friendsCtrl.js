var Friends = angular.module('app.friends', []);

Friends.factory('Friend', function($http) {
  var searchFriend = function(user_id, input) {
    return $http({
      method: 'POST',
      url: '/api/searchfriend/' + user_id,
      data: input
    })
    .then(function(res) {
      return res.data;
    });
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
      url: '/api/friends/pending/' + user_id,
      data: answer
    })
    .then(function(res) {
      return res.data;
    });
  };

  return {
    searchFriend: searchFriend,
    getFriends: getFriends,
    addFriend: addFriend,
    removeFriend: removeFriend,
    answerFriendReq: answerFriendReq
  };
});

Friends.controller('FriendsController', function($scope, auth, Friend) {
  // User profile information from Auth0 db
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

  $scope.searchData = {};

  $scope.searchFriend = function() {
    var input = $scope.input;
    var user_id = $scope.profile.user_id;
    Friend.searchfriend(user_id, input)
      .then(function(data) {
        console.log(data);
        $scope.searchData = data;
        for(var key in $scope.input) {
          $scope.input[key] = '';
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

});