angular.module('app.premium',[])
  .controller('PremiumController', PremiumController);
  // Dependency injection. Done this way for minification purposes.
PremiumController.$inject = ['$scope', 'auth', 'Premium',];

function PremiumController($scope, auth, Premium) {
  // User information from our MongoDB
  $scope.guides = [];

  $scope.getGuides = function(){
    Premium.getPremium()
      .then(function(guides) {
        $scope.guides = guides;
      })
      .catch(function(error) {
        console.error(error);
      });
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
      window.alert('success! token: ' + result.id);
      Premium.sendToken(result);
    }
  };
}
