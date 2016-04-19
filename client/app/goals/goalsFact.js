angular
  .module('app.goals')
  .factory('Goals', Goals);

// Dependency injection. Done this way for minification purposes.
Goals.$inject = ['$http'];

function Goals($http) {
  return {
    // GETs list of goals from our MongoDB
    getGoals: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/goals/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    // POSTs new goal to our MongoDB
    addGoal: function(user_id, goal) {
      return $http({
          method: 'POST',
          url: '/api/goals/' + user_id,
          data: goal
        })
        .then(function(res) {
          return res.data;
        });
    }
  };
}
