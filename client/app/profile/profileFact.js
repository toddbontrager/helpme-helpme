angular
  .module('app.profile')
  .factory('Profile', Profile);

// Dependency injection. Done this way for minification purposes.
Profile.$inject = ['$http'];

function Profile($http) {
  return {
    // GETs user profile info from our MongoDB
    getProfile: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/profile/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    // GETs list of user's posts from our MongoDB
    getPosts: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/profile/posts/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    // POSTs new post to our MongoDB
    addPost: function(user_id, post) {
      return $http({
          method: 'POST',
          url: '/api/profile/posts/' + user_id,
          data: post
        })
        .then(function(res) {
          return res.data;
        });
    },

    // POSTs new comment to our MongoDB
    addComment: function(user_id, goal_id, post_id, input, friend_id) {
      var comment = {
        friend_id: friend_id || user_id,
        goal_id: goal_id,
        post_id: post_id,
        comment: input
      };
      return $http({
          method: 'POST',
          url: '/api/comment/' + user_id,
          data: comment
        })
        .then(function(res) {
          return res.data;
        });
    },

    // Helper method for updating comment array for a specific post after new comment submission
    pushComment: function(data, currentPosts, count) {
      for (var i = 0; i < currentPosts.length; i++) {
        var post = currentPosts[i];
        var last = data.comments.length - 1;
        // find the post that need to updated
        if (post._id === data._id) {
          var newComment = data.comments[last];
          // push the new comment
          post.comments.push(newComment);
          // update current count
          ++count[post.post];
          return;
        }
      }
    },

    // Helper method returning comment counter object
    countComment: function(posts) {
      var count = {};
      posts.forEach(function(post) {
        count[post.post] = post.comments.length;
      });
      return count;
    },

    // Helper method for live updating of comments arrays for all posts
    checkComment: function(currentCount, newCount, currentPosts, newPosts) {
      for (var post in currentCount) {
        // check for any difference in current and new count
        if (currentCount[post] !== newCount[post]) {
          for (var i = 0; i < currentPosts.length; i++) {
            var obj = currentPosts[i];
            // find the post that needs to be updated
            if (obj.post === post) {
              // push the new comment in the post
              var lastIndex = newPosts[i].comments.length - 1;
              var newComment = newPosts[i].comments[lastIndex];

              obj.comments.push(newComment);
              // make commentCount same to count
              currentCount[post] = newCount[post];
            }
          }
        }
      }
    }
  };
}
