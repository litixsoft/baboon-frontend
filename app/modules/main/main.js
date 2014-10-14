'use strict';
angular.module('main', [
  'common',
  'lx.navigation',
  'lx.socket',
  'ui.router',
  'ui.bootstrap',
  'main.home',
  'main.about',
  'main.contact'
])
  .constant('ACTIVE_APP', 'main')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $lxNavigationProvider) {

    // Routing and navigation
    $urlRouterProvider.otherwise('/main/home');
    $locationProvider.html5Mode(true);

        $lxNavigationProvider.set({
            navigation: {
                main: [
                    {
                        title: 'Home',
                        state: 'mainHome',
                        route: '/main/home',
                        app: 'main'
                    },
                    {
                        title: 'About',
                        state: 'mainAbout',
                        route: '/main/about',
                        app: 'main'
                    },
                    {
                        title: 'Contact',
                        state: 'mainContact',
                        route: '/main/contact',
                        app: 'main'
                    },
                    {
                        title: 'Examples',
                        state: 'examplesHome',
                        route: '/examples/home',
                        app: 'examples'
                    },
                    {
                        title: 'Admin',
                        state: 'adminHome',
                        route: '/admin/home',
                        app: 'admin'
                    }
                ]
            }
        });
  });

