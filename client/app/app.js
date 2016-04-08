var app = angular.module('app', ['app.auth', 'app.services', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/signin');

  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/partials/partial-signin.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/partials/partial-signup.html',
      controller: 'AuthController'
    })
    .state('app', {
      url: '/app',
      templateUrl: 'app/partials/partial-app.html',
      controller: 'AppController',
      authenticate: true
    })
      .state('app.main', {
        url: '/main',
        templateUrl: 'app/partials/partial-app-main.html',
        controller: 'AppController',
        authenticate: true
      })
      .state('app.goal', {
        url: '/goal',
        templateUrl: 'app/partials/partial-app-goal.html',
        controller: 'AppController',
        authenticate: true
      })
      .state('app.friends', {
        url: '/friends',
        templateUrl: 'app/partials/partial-app-friends.html',
        controller: 'AppController',
        authenticate: true
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'app/partials/partial-app-profile.html',
        controller: 'AppController',
        authenticate: true
      });
});
