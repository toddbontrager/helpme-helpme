angular
  .module('app.friends')
  .factory('Friend', Friend);

Friend.$inject = ['$http'];

function Friend($http) {
  var searchFriend = function(user_id, input) {
    return $http({
      method: 'POST',
      url: '/api/friends/search/',
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

  var getPendingReqs = function(user_id) {
      return $http({
        method: 'GET',
        url: '/api/friends/pending/' + user_id
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

  var getFriendsPosts = function(user_id) {
    return $http({
      method: 'GET',
      url: '/api/main/' + user_id
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
    getPendingReqs: getPendingReqs,
    answerFriendReq: answerFriendReq,
    getFriendsPosts: getFriendsPosts
  };
}