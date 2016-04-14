angular
  .module('app.main', [])
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
        console.log($scope.user.goals);
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

  // $scope.getFriendsPosts = function() {
  //   Friend.getFriendsPosts($scope.profile.user_id)
  //     .then(function(data) {
  //       $scope.friends = data;
  //       console.log($scope.friends);
  //     })
  //     .catch(function(error) {
  //       console.error(error);
  //     })
  // };

  // $scope.getFriendsGoals = function() {
  //   $scope.friends.forEach(function(friend) {
  //     Goals.getGoals(friend.friend.auth_id)
  //     .then(function(goals) {
  //       friend.goals = goals;
  //       console.log(friend);
  //     })
  //     .catch(function(error) {
  //       console.error(error);
  //     });
  //   });
  // }

  // $scope.getFriends = function() {
  //   Friend.getFriends($scope.profile.user_id)
  //     .then(function(data) {
  //       $scope.friends = data;
  //       console.log($scope.friends);
  //       // $scope.getFriendsGoals();
  //     })
  //     .catch(function(error) {
  //       console.error(error);
  //     });
  // };

  // $scope.getFriends();
  $scope.getInactiveFriends();
  $scope.getGoals();
};