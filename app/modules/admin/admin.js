'use strict';

angular.module('admin', [
    'lx.navigation',
    'ui.router',
    'common',
    'admin.home'
])
    .constant('ACTIVE_APP', 'admin')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $lxNavigationProvider) {
        // Routing and navigation
        $urlRouterProvider.otherwise('/admin/home');
        $lxNavigationProvider.set({
            navigation: {
                main: [
                    {
                        title: 'Home',
//                        state: 'mainHome',
                        route: '/main/home',
                        app: 'main'
                    },
                    {
                        title: 'Examples',
//                        state: 'examplesHome',
                        route: '/examples/home',
                        app: 'examples'
                    },
                    {
                        title: 'Admin',
                        state: 'adminHome',
//                        route: '/admin/home',
                        app: 'admin'
                    }
                ]
            }
        });
    });

