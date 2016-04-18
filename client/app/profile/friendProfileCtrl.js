angular
  .module('app.viewfriend', [])
  .controller('ViewFriendController', ViewFriendController);

ViewFriendController.$inject = ['$scope', '$stateParams', 'auth', 'Profile', 'Goals'];

function ViewFriendController($scope, $stateParams, auth, Profile, Goals) {
  // User profile information from Auth0 db
  $scope.friend = {};
  $scope.friend.id = $stateParams.friendID;
  // Form input fields
  $scope.input = {};
  $scope.isAddCommentClosed = true;
  $scope.isGoalsClosed = true;

  var currentCount;

  $scope.getGoals = function() {
    Goals.getGoals($scope.friend.id)
      .then(function(goals) {
        $scope.friend.goals = goals;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

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
        currentCount = Profile.countComment(data.posts);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addComment = function(post_id, goal_id, input) {
    if(input) {
      Profile.addComment($scope.currentUser, goal_id, post_id, input, $scope.friend.id)
        .then(function(data) {
          Profile.pushComment(data, $scope.friend.posts, currentCount);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  // Once auth0 profile info has been set, query our database for user's profile and posts
  auth.profilePromise.then(function(profile) {
    $scope.currentUser = profile.user_id;
    $scope.getProfile();
    $scope.getGoals();
    $scope.getPosts();
  });
}
