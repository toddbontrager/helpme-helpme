angular
  .module('app.viewfriend', [])
  .controller('ViewFriendController', ViewFriendController);

// Dependency injection. Done this way for minification purposes.
ViewFriendController.$inject = ['$scope', '$stateParams', 'auth', 'Profile', 'Goals'];

function ViewFriendController($scope, $stateParams, auth, Profile, Goals) {
  // User profile information from Auth0 db
  $scope.friend = {};
  $scope.friend.id = $stateParams.friendID;
  // Form input fields
  $scope.input = {};

  // Used to toggle display of add comment field and friend's goals
  $scope.isAddCommentClosed = true;
  $scope.isGoalsClosed = true;

  // Comment counter
  var currentCount;

  // Retrieves the friend's goals data
  $scope.getGoals = function() {
    Goals.getGoals($scope.friend.id)
      .then(function(goals) {
        $scope.friend.goals = goals;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Retrieve friend's user information
  $scope.getProfile = function() {
    Profile.getProfile($scope.friend.id)
      .then(function(data) {
        $scope.friend.info = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Retrieve friend's posts data
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

  // Add a comment to a friend's post
  $scope.addComment = function(post_id, goal_id, input) {
    if(input) {
      Profile.addComment($scope.currentUser, goal_id, post_id, input, $scope.friend.id)
        .then(function(data) {
          // Adds comment without fully refreshing the data
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
