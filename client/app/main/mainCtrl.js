angular
  .module('app.main', ['angularMoment'])
  .controller('MainController', MainController);

MainController.$inject = ['$scope', 'auth', 'Goals', 'Friend'];

function MainController($scope, auth, Goals, Friend) {
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields

  $scope.getGoals = function() {
    Goals.getGoals($scope.profile.user_id)
      .then(function(goals) {
        $scope.user.goals = goals;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getInactiveFriends = function() {
    Friend.getInactiveFriends($scope.profile.user_id)
      .then(function(data) {
        $scope.friends = data;
      })
      .catch(function(error) {
        console.error(error);
      })
  };

  $scope.getInactiveFriends();
  $scope.getGoals();
};