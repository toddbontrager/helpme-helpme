var Friends = angular.module('app.friends', []);

Friends.factory('Friend', function($http) {
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

  return {
    searchFriend: searchFriend,
    getFriends: getFriends,
    addFriend: addFriend,
    removeFriend: removeFriend,
    getPendingReqs: getPendingReqs,
    answerFriendReq: answerFriendReq
  };
});

Friends.controller('FriendsController', function($scope, auth, Friend, $timeout) {
  // User profile information from Auth0 db
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

  $scope.searchData = {};
  $scope.showSubmitted = false;
  $scope.isPending = false;

  $scope.searchFriend = function() {
    var input = $scope.input;
    Friend.searchFriend($scope.profile.user_id, input)
      .then(function(data) {
        $scope.searchData.users = data;
        for(var key in $scope.input) {
          $scope.input[key] = '';
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getFriends = function() {
    Friend.getFriends($scope.profile.user_id)
      .then(function(data) {
        $scope.user.friends = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addFriend = function(friend_id) {
    var friend = { friend_id: friend_id };
    Friend.addFriend($scope.profile.user_id, friend)
      .then(function(data) {
        $scope.showSubmitted=true;
        $timeout(function(){ $scope.showSubmitted=false;},3000);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.removeFriend = function(friend_id) {
    var friend = { friend_id: friend_id };
    Friend.removeFriend($scope.profile.user_id, friend)
      .then(function(data) {
        $scope.getFriends();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getPendingReqs = function() {
    Friend.getPendingReqs($scope.profile.user_id)
      .then(function(data) {
        $scope.user.pending = data;
        if($scope.user.pending.length > 0) {
          $scope.isPending = true;
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.answerFriendReq = function(friend_id, answer) {
    var beFriends = { friend_id: friend_id, answer: answer };
    console.log(beFriends);
    Friend.answerFriendReq($scope.profile.user_id, beFriends)
      .then(function(data) {
        console.log(data);
        $scope.getPendingReqs();
        $scope.getFriends();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getPendingReqs();
  $scope.getFriends();

});