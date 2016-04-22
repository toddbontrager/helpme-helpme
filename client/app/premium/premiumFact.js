angular.module('app.premium')
  .factory('Premium', Premium);
// Dependency injection. Done this way for minification purposes.
Premium.$inject = ['$http'];

function Premium($http) {
  // GET for all premium guides
  var getPremium = function() {
    return $http({
      method: 'GET',
      url: '/api/guides',
    })
    .then(function(res) {
      return res.data;
    });
  };
  return {
    getPremium: getPremium,
  };
}