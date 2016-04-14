angular
  .module('app.profile', ['angularMoment'])
  .controller('ProfileController', ProfileController);

ProfileController.$inject = ['$scope', 'auth', 'Profile'];

function ProfileController($scope, auth, Profile) {
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
    var user_id = $scope.profile.user_id;
    var post = {
      post: $scope.input.post,
      goal_id: $scope.input.selected._id,
    };
    Profile.addPost(user_id, post)
      .then(function(data) {
        $scope.input.post = '';
        $scope.getPosts();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getProfile();
  $scope.getPosts();
}
