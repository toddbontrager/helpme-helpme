angular.module('app.premium', [])
.controller('PremiumController', PremiumController)
.controller('ModalInstanceCtrl', ModalInstanceCtrl);
// Dependency injection. Done this way for minification purposes.
PremiumController.$inject = ['$scope', 'auth', 'Premium', 'Goals', '$uibModal', 'Profile'];
ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'Premium', 'auth', 'Profile'];

function PremiumController($scope, auth, Premium, Goals, $uibModal, Profile) {
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
    });
  };

  $scope.getDataMax = function(goal) {
    var oneDay = 24*60*60*1000 // hours*minutes*seconds*milliseconds
    var createdAt = new Date();
    if (goal.posts.length > 1) {
      createdAt = new Date(goal.posts[0].createdAt);
    }
    var currentDate = new Date();
    var elapsedDays = Math.ceil((currentDate.getTime() - createdAt.getTime()) / oneDay) || 1;
    console.log(elapsedDays);
    return elapsedDays;
  };

  $scope.getPremium = function (user_id) {
    Profile.getProfile (user_id)
    .then(function (data) {
      $scope.access = data.premium;
    });
  };

  // Once auth0 profile info has been set, query our database for guides.   
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
    $scope.getGuides();
    $scope.getGoals();
    $scope.getPremium(profile.user_id);
  });


  //Modal
  $scope.open = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl'
    });

    modalInstance.result.then(function (access) {
      $scope.access = access;
    });
  };
}

function ModalInstanceCtrl($scope, $uibModalInstance, Premium, auth, Profile) {
  $scope.access = false;

  $scope.stripeCallback = function (code, result) {
    if (result.error) {
      console.error(result.error.message);
    } else {
      Premium.sendToken(result);
      Profile.updateProfile($scope.profile.user_id, { premium: true })
      .then(function (user) {
        $scope.access = user.premium;
      });
      $scope.ok();
      window.location.reload(true);
    }
  };
  //closes modal
  $scope.ok = function () {
    $uibModalInstance.close($scope.access);
  };
  //cancels and closes modal
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
  });
}
