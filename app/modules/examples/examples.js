'use strict';

angular.module('examples', [
    'ngRoute',
    'ui.bootstrap',
    'lx.navigation',
    'examples.home'
])
    .constant('ACTIVE_APP', 'examples')
    .config(function ($routeProvider, $locationProvider, $lxNavigationProvider) {
        // routing
        $locationProvider.html5Mode(true);
        $routeProvider.otherwise({redirectTo: '/examples/home'});

        // navigation
        $lxNavigationProvider.set({
            navigation: {
                main: [
                    {
                        title: 'Home',
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
                    },
                    {
                        title: 'Examples',
                        route: '/examples/home',
                        app: 'examples'
                    },
                    {
                        title: 'Admin',
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
                        route: '/examples/home',
                        app: 'examples'
                    },
                    {
                        title: 'Admin',
                        route: '/admin/home',
                        app: 'admin'
                    }
                ]
            }
        });
    })
    .run(function ($rootScope) {
        $rootScope.pathNav = 'assets/includes/nav_list.html';
        $rootScope.pathNavTree = 'assets/includes/nav_tree_outside.html';
    });

