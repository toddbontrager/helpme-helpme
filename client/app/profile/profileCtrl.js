angular
  .module('app.profile', [])
  .controller('ProfileController', ProfileController);

// Dependency injection. Done this way for minification purposes.
ProfileController.$inject = ['$scope', '$timeout', 'auth', 'Profile'];

function ProfileController($scope, $timeout, auth, Profile) {
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};
  // isAddCommentClosed is a toggle to allow for the add comment field to be displayed
  $scope.isAddCommentClosed = true;

  var currentCount;

  // Retrieves the user's information
  $scope.getProfile = function() {
    Profile.getProfile($scope.profile.user_id)
      .then(function(data) {
        $scope.user.info = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Retrieves posts for all of the user's goals
  $scope.getPosts = function() {
    Profile.getPosts($scope.profile.user_id)
      .then(function(data) {
        $scope.user.goals = data.goals;
        $scope.user.posts = data.posts;
        $scope.input.selected = $scope.user.goals[0];
        currentCount = Profile.countComment(data.posts);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  // Add a post to a user's goal
  $scope.addPost = function() {
    // Check to be sure the text field isn't empty
    if($scope.input.post) {
      var post = {
        post: $scope.input.post,
        goal_id: $scope.input.selected._id,
      };
      Profile.addPost($scope.profile.user_id, post)
        .then(function(data) {
          // Reset input field
          $scope.input.post = '';
          // Refresh posts to show the new post
          $scope.getPosts();
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  // Add a comment to the user's post
  $scope.addComment = function(post_id, goal_id, input) {
    // Check to verify that the input field isn't empty
    if(input) {
      Profile.addComment($scope.profile.user_id, goal_id, post_id, input)
        .then(function(data) {
          // push the new comment to the relevant comment array
          Profile.pushComment(data, $scope.user.posts, currentCount);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  // Checks with the back-end every couple of seconds to add new posts/comments without
  // refreshing the views entirely. This prevents the user from being popped to the top
  // of the screen while providing the live data.
  $scope.poller = function() {
    // create an array similar to $scope.posts
    var newPosts = [];
    Profile.getPosts($scope.profile.user_id)
      .then(function(data) {
        newPosts = data.posts;
        // count the comment in each post
        var newCount = Profile.countComment(newPosts);
        return newCount;
      })
      .then(function(newCount) {
        // check for any difference in currentCount and newCount
        Profile.checkComment(currentCount, newCount, $scope.user.posts, newPosts);
      })
      .catch(function(error) {
        console.error(error);
      });
    $timeout($scope.poller, 2000);
  };

  // Once auth0 profile info has been set, query our database for user's profile and posts
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
    $scope.getProfile();
    $scope.getPosts();
    $scope.poller();
  });
}
