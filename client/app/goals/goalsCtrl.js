angular
  .module('app.goals', [])
  .controller('GoalsController', GoalsController);

GoalsController.$inject = ['$scope', 'auth', 'Goals'];

function GoalsController($scope, auth, Goals) {
  // User Goals information from Auth0 db
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

  $scope.getGoals = function() {
    Goals.getGoals($scope.profile.user_id)
      .then(function(goals) {
        $scope.user.goals = goals;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addGoal = function() {
    var user_id = $scope.profile.user_id;
    var goal = {
      title: $scope.input.title,
      description: $scope.input.description,
      due_date: $scope.input.due_date
    };
    Goals.addGoal(user_id, goal)
      .then(function(data) {
        console.log(data);
        $scope.input.title = '';
        $scope.input.description = '';
        $scope.getGoals();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Once auth0 profile info has been set, query our database for user's goals
  auth.profilePromise.then(function(profile) {
    $scope.getGoals();
  });
}
