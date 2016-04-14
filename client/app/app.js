angular
  .module('app', [
    'auth0',
    'angular-storage',
    'angular-jwt',
    'app.auth',
    'app.profile',
    'app.goals',
    'app.services',
    'app.controller',
    'app.friends',
    'app.main',
    'ui.router'
  ])
  .config(config)
  .run(authCheck);

config.$inject = ['authProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'jwtInterceptorProvider'];

function config(authProvider, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {
  // Auth 0 init
  authProvider.init({
    domain: 'app49478086.auth0.com',
    clientID: 'eUhGC2gbYwdyQ9J6V1570qHSrCxZY6jw',
    loginState: 'signin'
  });

  $urlRouterProvider.otherwise('/main');

  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/partials/partial-signin.html',
      controller: 'LoginController'
    })
    .state('app', {
      url: '',
      templateUrl: 'app/partials/partial-app.html',
      controller: 'AppController',
      data: { requiresLogin: true },
      redirectTo: 'app.main'
    })
    .state('app.main', {
      url: '/main',
      templateUrl: 'app/partials/partial-app-main.html',
      controller: 'MainController',
      data: { requiresLogin: true }
    })
    .state('app.goals', {
      url: '/goals',
      templateUrl: 'app/partials/partial-app-goals.html',
      controller: 'GoalsController',
      data: { requiresLogin: true }
    })
    .state('app.friends', {
      url: '/friends',
      templateUrl: 'app/partials/partial-app-friends.html',
      controller: 'FriendsController',
      data: { requiresLogin: true }
    })
    .state('app.profile', {
      url: '/profile',
      templateUrl: 'app/partials/partial-app-profile.html',
      controller: 'ProfileController',
      data: { requiresLogin: true }
    });

  authProvider.on('loginSuccess', function($state, profilePromise, idToken, store, UserAuth) {
    console.log('Login Success');
    profilePromise.then(function(profile) {
      // Add user to our MongoDB if user doesn't already exist
      UserAuth.addUserToDB(profile);

      // Save auth profile and token in local storage
      store.set('profile', profile);
      store.set('token', idToken);
    });
    $state.go('app.main');
  });

  authProvider.on('loginFailure', function() {
     // Error Callback
     console.log('Login Error');
  });

  // We're annotating this function so that the `store` is injected correctly when this file is minified
  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    // Return the saved token
    return store.get('token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
}


authCheck.$inject = ['$rootScope', 'auth', 'store', 'jwtHelper', '$location', '$state'];

function authCheck($rootScope, auth, store, jwtHelper, $location, $state) {
  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();

  $rootScope.$on('$stateChangeStart', function(evt, to, params) {
    if (to.redirectTo) {
      evt.preventDefault();
      $state.go(to.redirectTo, params);
    }
  });

  $rootScope.$on('$locationChangeStart', function() {
    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        // Either show the login page or use the refresh token to get a new idToken
        $location.path('/main');
      }
    }
  });
}
