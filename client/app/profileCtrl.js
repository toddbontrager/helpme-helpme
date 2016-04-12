var Profile = angular.module('app.profile', []);

Profile.controller('ProfileController', function($scope, auth, Profile) {
  // User profile information from Auth0 db
  $scope.profile = auth.profile;
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
      user_id: $scope.profile.user_id,
      post: $scope.input.post,
      goalId: $scope.input.selected.id,
    };
    Profile.addPost(post)
      .then(function(data) {
        console.log(data);
        $scope.input.post = '';
        $scope.getProfile();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getProfile();
  $scope.getPosts();
});
