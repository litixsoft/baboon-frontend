'use strict';

angular.module('examples', [
  'lx.navigation',
  'ui.router',
  'ui.bootstrap',
  'examples.home'
])
  .constant('ACTIVE_APP', 'examples')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $lxNavigationProvider) {

    // Routing and navigation
    $urlRouterProvider.otherwise('/examples/home');
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
                ],
                tree: [
                    {
                        title: 'Main',
                        app: 'main',
                        children: [
                            {
                                title: 'Home',
                                state: 'mainHome',
                                route: '/main/home',
                                app: 'main'
                            },
                            {
                                title: 'About',
                                route: '/main/about',
                                app: 'main'
                            },
                            {
                                title: 'Contact',
                                route: '/main/contact',
                                app: 'main'
                            }
                        ]
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
  })
    .run(function($rootScope){
        $rootScope.pathNav = 'common/lx_navigation/nav_list.html';
        $rootScope.pathNavTree = 'common/lx_navigation/nav_tree_outside.html';
    });

