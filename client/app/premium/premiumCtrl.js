angular.module('app.premium', [
  'app.goals'
])
.controller('PremiumController', PremiumController);
// Dependency injection. Done this way for minification purposes.
PremiumController.$inject = ['$scope', 'auth', 'Premium', 'Goals'];

function PremiumController($scope, auth, Premium) {
  // User information from our MongoDB
  $scope.guides = [];
  $scope.user = {};

  $scope.getGuides = function() {
    Premium.getGuides()
      .then(function(guides) {
        $scope.guides = guides;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getGoals = function() {
    Goals.getGoals($scope.profile.user_id)
    .then(function(goals) {
      $scope.user.goals = goals;
    })
    .catch(function(error) {
      console.error(error);
    })
  };

  // Once auth0 profile info has been set, query our database for guides.
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
    $scope.getGuides();
  });

  $scope.stripeCallback = function (code, result) {
    if (result.error) {
      console.error(result.error.message);
    } else {
      Premium.sendToken(result);
    }
  };
}
