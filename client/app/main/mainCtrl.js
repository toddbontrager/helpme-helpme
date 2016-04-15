angular
  .module('app.main', [])
  .controller('MainController', MainController);

MainController.$inject = ['$scope', 'auth', 'Goals', 'Friend', 'Profile'];

function MainController($scope, auth, Goals, Friend, Profile) {
  // User information from our MongoDB
  $scope.user = {};

  $scope.getGoals = function() {
    Goals.getGoals($scope.profile.user_id)
      .then(function(goals) {
        $scope.user.goals = goals;
        $scope.user.goals.forEach(function(goal) {
          $scope.checkGoalsH(goal);
        })
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Hours version for actual
  $scope.checkGoalsH = function(goal, friend) {
    var message = {};
    var goalDate = new Date(goal.updatedAt);
    var currDate = new Date();
    var dateDiff = (currDate - goalDate)/3600000;
    if(friend) {
      message.great="Your friend is doing great! Be sure to let them know!";
      message.good="It's been a couple of days since your friend updated their goal. Maybe cheer them on to get them motivated!";
      message.bad="It's been days since your friend updated their goal. Don't let them give up now!";
      message.terrible="Oh no!!! Your friend hasn't updated their goal in over a week. Are they ok? Be sure to check in with\
      them to see how they're doing!";
    } else {
      message.great="Doing great! Keep it up!!!";
      message.good="It's been a couple of days since you updated this goal. Keep at it and post to your friends to let them know!";
      message.bad="It's been days since you updated this goal. Don't give up now! You can do it!";
      message.terrible="It's been more than a week since you last updated this goal. What happened?! Is everything ok? Be sure to \
      reach out to your friends for some support if you need it!";
    }
    if(dateDiff < 24) {
      goal.status = message.great;
    } else if (dateDiff < 48) {
      goal.status = message.good;
    } else if (dateDiff < 168) {
      goal.status = message.bad;
    } else {
      goal.status = message.terrible;
    }
  }

  // Minutes version for testing
  $scope.checkGoalsM = function(goal, friend) {
    var message = {};
    var goalDate = new Date(goal.updatedAt);
    var currDate = new Date();
    var dateDiff = (currDate - goalDate)/60000;
    if(friend) {
      message.great="Your friend is doing great! Be sure to let them know!";
      message.good="It's been more than 15 minutes since your friend updated their goal. Maybe cheer them on to get them motivated!";
      message.bad="It's over 30 minutes since your friend updated their goal. Don't let them give up now!";
      message.terrible="Oh no!!! Your friend hasn't updated their goal in over an hour. Are they ok? Be sure to check in with\
      them to see how they're doing!";
    } else {
      message.great="Doing great! Keep it up!!!";
      message.good="It's been more than 15 minutes since you updated this goal. Keep at it and post to your friends to let them know!";
      message.bad="It's been over 30 minutes you updated this goal. Don't give up now! You can do it!";
      message.terrible="It's been more than an hour since you last updated this goal. What happened?! Is everything ok? Be sure to \
        reach out to your friends for some support if you need it!";
    }
    if(dateDiff < 15) {
        goal.status = message.great;
      } else if (dateDiff < 30) {
        goal.status = message.good;
      } else if (dateDiff < 60) {
        goal.status = message.bad;
      } else {
        goal.status = message.terrible;
    }
  }

  $scope.getInactiveFriends = function() {
    Friend.getInactiveFriends($scope.profile.user_id)
      .then(function(data) {
        $scope.friends = data;
        $scope.friends.forEach(function(friend) {
          $scope.checkGoalsH(friend, true);
        })
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

  $scope.addPost = function() {
    var post = {
      post: $scope.input.post,
      goal_id: $scope.input.selected._id,
    };
    Profile.addPost($scope.profile.user_id, post)
      .then(function(data) {
        $scope.input.post = '';
        $scope.getGoals();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addComment = function(post_id, goal_id, input, friend_id) {
    Profile.addComment($scope.profile.user_id, goal_id, post_id, input, friend_id)
      .then(function(data) {
        for(var i = 0; i < $scope.posts.length; i++) {
          var post = $scope.posts[i];
          var last = data.comments.length-1;
          if (post._id === data._id) {
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
    $scope.profile = profile;
    $scope.getFriendsPosts();
    $scope.getInactiveFriends();
    $scope.getGoals();
  });
}