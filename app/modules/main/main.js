'use strict';

angular.module('main', [
    'ngRoute',
    'common',
    'lx.navigation',
    'main.home',
    'main.about',
    'main.contact'
])
    .constant('ACTIVE_APP', 'main')
    .config(function ($routeProvider, $locationProvider, $lxNavigationProvider) {
        $routeProvider.otherwise({redirectTo: '/'});

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
                ]
            }
        });
    });

