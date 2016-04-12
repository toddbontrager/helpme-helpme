var Profile = angular.module('app.profile', []);

Profile.controller('ProfileController', function($scope, auth, Profile) {
  // User profile information from Auth0 db
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

  var reduceGoalstoPosts = function(goals) {
    return goals.reduce(function(memo, goal) {
      goal.posts.forEach(function(post) {
        post.title = goal.title;
        memo.push(post);
      });
      return memo;
    }, []);
  };

  $scope.getProfile = function() {
    Profile.getProfile($scope.profile)
      .then(function(data) {
        $scope.user = data;
        var goals = $scope.user.goals;
        $scope.user.posts = reduceGoalstoPosts(goals);
        $scope.input.selected = goals[0];
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addPost = function() {
    var post = {
      user_id: $scope.user.user_id,
      post: $scope.input.post,
      goalId: $scope.input.selected.id,
    };
    Profile.addPost(post)
      .then(function(data) {
        console.log(data);
        $scope.getProfile();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getProfile();
});
