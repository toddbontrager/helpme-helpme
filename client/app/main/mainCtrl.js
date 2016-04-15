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
          var last = data.comments.length-1;

          if (post.goal_id === data.goal_id) {
            var newComment = data.comments[last];
            post.comments.push(newComment);
            return;
          }
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Once auth0 profile info has been set, query our database for friends' posts, inactive friends and personal goals.
  auth.profilePromise.then(function(profile) {
    $scope.getFriendsPosts();
    $scope.getInactiveFriends();
    $scope.getGoals();
  });
}