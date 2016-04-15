angular
  .module('app.profile', [])
  .controller('ProfileController', ProfileController);

ProfileController.$inject = ['$scope', 'auth', 'Profile'];

function ProfileController($scope, auth, Profile) {
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

  $scope.getProfile = function() {
    Profile.getProfile($scope.profile.user_id)
      .then(function(data) {
        $scope.user.info = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getPosts = function() {
    Profile.getPosts($scope.profile.user_id)
      .then(function(data) {
        $scope.user.goals = data.goals;
        $scope.user.posts = data.posts;
        $scope.input.selected = $scope.user.goals[0];
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addPost = function() {
    var post = {
      post: $scope.input.post,
      goal_id: $scope.input.selected._id,
    };
    Profile.addPost($scope.profile.user_id, post)
      .then(function(data) {
        $scope.input.post = '';
        $scope.getPosts();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addComment = function(post_id, goal_id, input) {
    Profile.addComment($scope.profile.user_id, goal_id, post_id, input)
      .then(function(data) {
        $scope.getPosts();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Once auth0 profile info has been set, query our database for user's profile and posts
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
    $scope.getProfile();
    $scope.getPosts();
  });
}
