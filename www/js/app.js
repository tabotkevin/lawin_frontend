// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.directives',
  'starter.filters',
  'starter.services',
  'ionic.ion.autoListDivider',
  'ngCordova',
  'base64', 
  'ngStorage'
])

.factory('User', function($q, $localStorage, $http) {
  
  var factory = {};
  // check if there's a user session present
  factory.checkSession = function() {
  // $localStorage.token = null;
    var defer = $q.defer();

    if ($localStorage.token) {
      // if this session is already initialized in the service
      defer.resolve(true);

    } else {
      // detect if there's a session in localstorage from previous use.
      // if it is, pull into our service
     // var user = $localStorage.user;

      if ($localStorage.token) {
        // if there's a user, lets grab their favorites from the server
        
          defer.resolve(true);

      } else {
        // no user info in localstorage, reject
        defer.resolve(false);
      }

    }

    return defer.promise;
  }

  return factory;

})

.run(function($ionicPlatform, $cordovaSplashscreen) {
  
  setTimeout(function() {
        $cordovaSplashscreen.hide()
    }, 3000);

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
  // note that you can also chain configs
  $ionicConfigProvider.backButton.text('').previousTitleText(false);
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    /*WELCOME*/
    
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl',
    resolve: {
      populateSession: function(User) {
        return User.checkSession();
      }
    },
    onEnter: function($state, User){
      User.checkSession().then(function(hasSession) {
        if (!hasSession) $state.go('/welcome');
      });
    }
  })

    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome/intro.html',
      controller: 'SignupCtrl',
      onEnter: function($state, User){
      User.checkSession().then(function(hasSession) {
        if (hasSession) $state.go('tab.home');
      });
    }
    })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home/home.html',
        controller: 'FeedsCtrl'
      }
    }
  })

  .state('tab.feed', {
    url: '/feed/:id',
    views: {
      'home': {
        templateUrl: 'templates/home/feed.html',
        controller: 'FeedCtrl'
      }
    }
  })

  .state('tab.search', {
    url: '/search/:query',
    views: {
      'home': {
        templateUrl: 'templates/search/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.netsearch', {
    url: '/netsearch/:query',
    views: {
      'lawyers': {
        templateUrl: 'templates/search/netsearch.html',
        controller: 'SearchCtrl'
      }
    }
  })


  .state('tab.user', {
    url: '/user/:id',
    views: {
      'home': {
        templateUrl: 'templates/user/user.html',
        controller: 'UserCtrl'
      }
    }
  })


  .state('tab.messaging', {
    url: '/messaging',
    views: {
      'messaging': {
        templateUrl: 'templates/messaging/messagesmenu.html',
        controller: 'MessagesMenuCtrl'
      }
    }
  })

  .state('tab.chat', {
    url: '/chat',
    views: {
      'messaging': {
        templateUrl: 'templates/messaging/chat.html',
        controller: 'DemoCtrl'
      }
    }
  })

  .state('tab.notifications', {
    url: '/notifications',
    views: {
      'notifications': {
        templateUrl: 'templates/notifications/notifications.html',
        controller: 'DemoCtrl'
      }
    }
  })

  .state('tab.lawyers', {
    url: '/lawyers',
    views: {
      'lawyers': {
        templateUrl: 'templates/lawyers/lawyers.html',
        controller: 'LawyersCtrl'
      }
    }
  })

  .state('tab.moi', {
    url: '/moi',
    views: {
      'moi': {
        templateUrl: 'templates/me/me.html',
        controller: 'ProfileCtrl'
      }
    }
  })

   .state('tab.edit-profile', {
    url: '/edit-profile',
    views: {
      'moi': {
        templateUrl: 'templates/me/edit-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.composs', {
      url: '/composs/:userId',
      views: {
        'home': {
          templateUrl: 'templates/messaging/composs.html',
          controller: 'CompossCtrl'
        }
      }
    })

  .state('tab.netcomposs', {
      url: '/netcomposs/:userId',
      views: {
        'lawyers': {
          templateUrl: 'templates/messaging/composs.html',
          controller: 'NetCompossCtrl'
        }
      }
    })

  .state('tab.inbox', {
      url: '/inbox',
      views: {
        'messaging': {
          templateUrl: 'templates/messaging/inbox.html',
          controller: 'InboxCtrl'
        }
      }
    })

    .state('tab.outbox', {
      url: '/outbox',
      views: {
        'messaging': {
          templateUrl: 'templates/messaging/outbox.html',
          controller: 'OutboxCtrl'
        }
      }
    })

    .state('tab.message', {
      url: '/message/:id',
      views: {
        'messaging': {
          templateUrl: 'templates/messaging/chat.html',
          controller: 'MessageCtrl'
        }
      }
    })

    .state('tab.logout', {
      url: '/logout',
      views: {
        'logout': {
          controller: 'LogOutCtrl'
        }
      }
    })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'moi': {
        templateUrl: 'templates/me/settings.html',
        controller: 'DemoCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});
