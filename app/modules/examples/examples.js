'use strict';

angular.module('examples', [
    'ngRoute',
    'ui.bootstrap',
    'lx.navigation',
    'lx.layout',
    'lx.form',
    'common.auth',
    'examples.home',
    'examples.about',
    'examples.lib'
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
                        roles: ['Guest'],
                        route: '/main/about',
                        app: 'main'
                    },
                    {
                        title: 'Contact',
                        route: '/main/contact',
                        resources: ['/awesomeThings'],
                        app: 'main'
                    },
                    {
                        title: 'Examples',
                        route: '/examples/home',
                        app: 'examples'
                    },
                    {
                        title: 'Admin',
                        roles: ['Admin'],
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
                                roles: ['Guest'],
                                app: 'main'
                            },
                            {
                                title: 'Contact',
                                route: '/main/contact',
                                resources: ['/awesomeThings'],
                                app: 'main'
                            }
                        ]
                    },
                    {
                        title: 'Examples',
                        app: 'examples',
                        children: [
                            {
                                title: 'Home',
                                route: '/examples/home',
                                app: 'examples'
                            },
                            {
                                title: 'About',
                                route: '/examples/about',
                                app: 'examples'
                            },
                            {
                                title: 'Lib',
                                route: '/examples/lib',
                                app: 'examples'
                            }
                        ]
                    },
                    {
                        title: 'Admin with a very long Title and ellipsis',
                        roles: ['Guest'],
                        route: '/admin/home',
                        app: 'admin'
                    }
                ]
            }
        });
    })
    .run(function ($rootScope, lxMessageBoxService, lxToastBoxService, $window, Auth) {
        $rootScope.isLoggedIn = Auth.userIsLoggedIn();

        $rootScope.testAclUser = {
            username: Auth.getUser().name,
            acl: Auth.getAcl(),
            roles: Auth.getRoles()
        };

        $rootScope.pathNav = 'assets/includes/nav_list.html';
        $rootScope.pathNavTree = 'assets/includes/nav_tree_outside.html';

        $rootScope.lxMessageBoxService = lxMessageBoxService;
        $rootScope.lxToastBoxService = lxToastBoxService;

        $rootScope.openToastAnimated = function () {
            $rootScope.lxToastBoxService.show('Hier steht eine kleine Nachricht mit dem was gerade passiert ist.', 'danger');
            $rootScope.lxToastBoxAnimated = true;
        };

        $rootScope.openToast = function () {
            $rootScope.lxToastBoxService.show('Hier steht eine kleine Nachricht mit dem was gerade passiert ist.', 'success');
            $rootScope.lxToastBoxAnimated = false;
        };

        $rootScope.openMsgAnimated = function () {
            $rootScope.lxMessageBoxAnimated = true;
            $rootScope.lxMessageBoxService.show('glyphicon glyphicon-trash', 'Delete Item', 'Soll das ausgewählte Item wirklich gelöscht werden?', ['ja', 'nein', 'vielleicht'], function (err, res) {
                console.log('Error: ', err);
                console.log('Result: ', res);
                if (res === 'ja') {
                    $rootScope.lxToastBoxAnimated = true;
                    $rootScope.lxToastBoxService.show('Item wurde erfolgreich gelöscht.', 'success');
                }
            });
        };

        $rootScope.openMsg = function () {
            $rootScope.lxMessageBoxAnimated = false;
            $rootScope.lxMessageBoxService.show('glyphicon glyphicon-trash', 'Delete Item', 'Soll das ausgewählte Item wirklich gelöscht werden?', ['ja', 'nein', 'vielleicht'], function (err, res) {
                console.log('Error: ', err);
                console.log('Result: ', res);
            });
        };

    });

