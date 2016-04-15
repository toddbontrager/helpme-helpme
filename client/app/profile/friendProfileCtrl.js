angular
  .module('app.viewFriend', [])
  .controller('ViewFriendController', ViewFriendController);

ViewFriendController.$inject = ['$scope', '$stateParams', 'auth', 'Profile'];

function ViewFriendController($scope, $stateParams, auth, Profile) {
  // User profile information from Auth0 db
  $scope.friend={};
  $scope.friend.id = $stateParams.friendID;
  $scope.currentUser = auth.profile;
  // Form input fields
  $scope.input = {};

  $scope.getProfile = function() {
    Profile.getProfile($scope.friend.id)
      .then(function(data) {
        $scope.friend.info = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getPosts = function() {
    Profile.getPosts($scope.friend.id)
      .then(function(data) {
        $scope.friend.goals = data.goals;
        $scope.friend.posts = data.posts;
        $scope.input.selected = $scope.friend.goals[0];
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addComment = function(post_id, goal_id, input) {
    var user_id = $scope.currentUser;
    Profile.addComment(user_id, goal_id, post_id, input)
      .then(function(data) {
        $scope.getPosts();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Once auth0 profile info has been set, query our database for user's profile and posts
  auth.profilePromise.then(function(profile) {
    $scope.getProfile();
    $scope.getPosts();
  });
}
