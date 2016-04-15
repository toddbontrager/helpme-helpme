angular
  .module('app.main', [])
  .controller('MainController', MainController);

MainController.$inject = ['$scope', 'auth', 'Goals', 'Friend', 'Profile'];

function MainController($scope, auth, Goals, Friend, Profile) {
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};

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
      });
  };

  $scope.getFriendsPosts = function() {
    $scope.posts = [];
    Friend.getFriendsPosts($scope.profile.user_id)
      .then(function(data) {
        data.forEach(function(obj) {
          var friend = {};
          friend.firstname = obj[0].firstname || '';
          friend.lastname = obj[0].lastname || '';
          friend.username = obj[0].username || '';
          friend.auth_id = obj[0].auth_id;
          obj[1].forEach(function(post) {
            post.friend = friend;
            $scope.posts.push(post);
          });
        });
        console.log($scope.posts);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addComment = function(post_id, goal_id, input, friend_id) {
    var user_id = $scope.profile.user_id;
    Profile.addComment(user_id, goal_id, post_id, input, friend_id)
      .then(function(data) {
        for(var i = 0; i < $scope.posts.length; i++) {
          var post = $scope.posts[i];
          if (post.goal_id === data.goal_id) {
            post.comments = data.comments;
            return;
          }
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getFriendsPosts();
  $scope.getInactiveFriends();
  $scope.getGoals();
}