angular.module('app.goals')

.factory('Goals', function($http) {
  return {
    getGoals: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/goals/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

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
});
