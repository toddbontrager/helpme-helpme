angular
  .module('app.friends', [])
  .controller('FriendsController', FriendsController);

// Dependency injection. Done this way for minification purposes.
FriendsController.$inject = ['$scope', 'auth', 'Friend', '$timeout'];

function FriendsController($scope, auth, Friend, $timeout) {
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

  $scope.searchData = {};

  // Variables to display data on the front end. Set to false by default.
  $scope.showSubmitted = false;
  $scope.isPending = false;

  // Sends search info to back-end to determine if there is a user with matching info
  $scope.searchFriend = function() {
    var input = { search: $scope.input.search };
    Friend.searchFriend($scope.profile.user_id, input)
      .then(function(data) {
        $scope.searchData.users = data;
      })
      .catch(function(error) {
        console.error(error);
      });
    $scope.input.search = '';
  };

  // Retrieves list of friends. Only shows Accepted friends (not Pending or Requested).
  $scope.getFriends = function() {
    Friend.getFriends($scope.profile.user_id)
      .then(function(data) {
        $scope.user.friends = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Sends a friend request to the individual.
  // Friend status for user: Requested
  // Friend status for potential friend: Pending
  $scope.addFriend = function(friend_id) {
    var friend = { friend_id: friend_id };
    Friend.addFriend($scope.profile.user_id, friend)
      .then(function(data) {
        // Toggles a friend request submitted message on the page for 3 seconds
        $scope.showSubmitted=true;
        $timeout(function(){ $scope.showSubmitted=false;},3000);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Removes friend from user's list of friends
  $scope.removeFriend = function(friend_id) {
    var friend = { friend_id: friend_id };
    Friend.removeFriend($scope.profile.user_id, friend)
      .then(function(data) {
        // getFriends called to refresh friends list
        $scope.getFriends();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Shows all pending friend requests. Once a friend is added, their friend status
  // updates to Accepted on the back-end.
  $scope.getPendingReqs = function() {
    Friend.getPendingReqs($scope.profile.user_id)
      .then(function(data) {
        $scope.user.pending = data;
        // If there are pending requests, display them on the page
        if($scope.user.pending.length > 0) {
          $scope.isPending = true;
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Pending friend requests are sent to this function once the user selects Accept or Decline
  $scope.answerFriendReq = function(friend_id, answer) {
    // If user declined, call removeFriend.
    // If user accepted, call answerFriendReq in factory to finalize the friendship.
    if(answer === false) {
      $scope.removeFriend(friend_id);
    } else {
      var friend = { friend_id: friend_id };
      Friend.answerFriendReq($scope.profile.user_id, friend)
        .then(function(data) {
          // Once accepted, refresh friends and pending friends
          $scope.getPendingReqs();
          $scope.getFriends();
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  // Once auth0 profile info has been set, query our database for user's friends and pending friend requests.
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
    $scope.getPendingReqs();
    $scope.getFriends();
  });

}
