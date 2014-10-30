'use strict';

angular.module('admin', [
    'lx.navigation',
    'ui.router',
    'common',
    'admin.home'
])
    .constant('ACTIVE_APP', 'admin')
    .config(function ($urlRouterProvider, $lxNavigationProvider) {
        // Routing and navigation
        $urlRouterProvider.otherwise('/admin/home');
        $lxNavigationProvider.set({
            navigation: {
                main: [
                    {
                        title: 'Home',
                        route: '/main/home',
                        app: 'main'
                    },
                    {
                        title: 'Examples',
                        route: '/examples/home',
                        app: 'examples'
                    },
                    {
                        title: 'Admin',
                        state: 'adminHome',
                        app: 'admin'
                    }
                ]
            }
        });
    });

