angular
  .module('app.payment')
  .factory('Payment', Payment);

// Dependency injection. Done this way for minification purposes.
Payment.$inject = ['$http'];

function Payment($http) {
  return {
    // GETs user profile info from our MongoDB
    submitPayment: function (token) {
      return $http({
          method: 'GET',
          url: '/api/charge/',
          data: token,
        })
        .then(function(res) {
          return res.data;
        });
    },
  };
}
