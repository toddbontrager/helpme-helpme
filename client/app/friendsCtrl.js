var Friends = angular.module('app.friends', []);

Friends.factory()

Friends.controller('FriendsController', function($scope, auth) {
  // User profile information from Auth0 db
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

});