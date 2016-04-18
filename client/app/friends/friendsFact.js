angular
  .module('app.friends')
  .factory('Friend', Friend);

// Dependency injection. Done this way for minification purposes.
Friend.$inject = ['$http'];

function Friend($http) {
  // POSTs search for other users to our MongoDB
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

  // GETs list of friends from our MongoDB
  var getFriends = function(user_id) {
    return $http({
      method: 'GET',
      url: '/api/friends/' + user_id
    })
    .then(function(res) {
      return res.data;
    });
  };

  // POSTs new friend request to our MongoDB
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

  // POSTs friend removal to our MongoDB
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

  // GETs list of pending friend requests from our MongoDB
  var getPendingReqs = function(user_id) {
      return $http({
        method: 'GET',
        url: '/api/friends/pending/' + user_id
      })
      .then(function(res) {
        return res.data;
      });
    };

  // POSTs answer to friend request to our MongoDB
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

  // GETs list of friends' posts from our MongoDB
  var getFriendsPosts = function(user_id) {
    return $http({
      method: 'GET',
      url: '/api/main/' + user_id
    })
    .then(function(res) {
      return res.data;
    });
  };

  // GETs list of inactive friends from our MongoDB
  var getInactiveFriends = function(user_id) {
    return $http({
      method: 'GET',
      url: '/api/main/inactive/' + user_id
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
    getFriendsPosts: getFriendsPosts,
    getInactiveFriends: getInactiveFriends
  };
}