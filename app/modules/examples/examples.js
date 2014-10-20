'use strict';

angular.module('examples', [
    'ngRoute',
    'ui.bootstrap',
    'lx.navigation',
    'lx.layout',
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
                        roles: ['User'],
                        route: '/main/home',
                        app: 'main'
                    },
                    {
                        title: 'About',
                        roles: ['User'],
                        route: '/main/about',
                        resources: ['/main/about'],
                        app: 'main'
                    },
                    {
                        title: 'Contact',
                        roles: ['User'],
                        route: '/main/contact',
                        app: 'main'
                    },
                    {
                        title: 'Examples',
                        roles: ['User'],
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
                        roles: ['User'],
                        children: [
                            {
                                title: 'Home',
                                route: '/main/home',
                                roles: ['User'],
                                resources: ['/main/home'],
                                app: 'main'
                            },
                            {
                                title: 'About',
                                route: '/main/about',
                                roles: ['User'],
                                resources: ['/main/about'],
                                app: 'main'
                            },
                            {
                                title: 'Contact',
                                route: '/main/contact',
                                roles: ['User'],
                                resources: ['/main/contact'],
                                app: 'main'
                            }
                        ]
                    },
                    {
                        title: 'Examples',
                        roles: ['User'],
                        app: 'examples',
                        children: [
                            {
                                title: 'Home',
                                route: '/examples/home',
                                roles: ['User'],
                                resources: ['/examples/home'],
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
                        roles: ['Admin'],
                        route: '/admin/home',
                        app: 'admin'
                    }

                ]
            }
        });
  })
    .run(function($rootScope, lxMessageBoxService, lxToastBoxService) {

        $rootScope.testAclUser = {
            username: 'horst',
            acl: {
                '/examples/home': true,
                '/admin/home':false,
                '/main/about':true,
                '/main/home':true
            },
            rolesAsObjects: [
                    { _id: '5419771e2e14156910000002', name: 'User' }
                ]
            };

        $rootScope.testAclAdmin = {
            username: 'sysadmin',
            acl: {
                '/examples/home': true,
                '/admin/home':true,
                '/main/home':true,
                '/main/about':false
            },
            rolesAsObjects: [
                { _id: '5419771e2e14156910000002', name: 'User' },
                { _id: '5419771e2e14156910000003', name: 'Admin' }
            ]
        };

        $rootScope.pathNav = 'assets/includes/nav_list.html';
        $rootScope.pathNavTree = 'assets/includes/nav_tree_outside.html';

        $rootScope.lxMessageBoxService = lxMessageBoxService;
        $rootScope.lxToastBoxService = lxToastBoxService;

        $rootScope.openToastAnimated = function(){
            $rootScope.lxToastBoxService.show('Hier steht eine kleine Nachricht mit dem was gerade passiert ist.','danger');
            $rootScope.lxToastBoxAnimated = true;
        };
        $rootScope.openToast = function(){
            $rootScope.lxToastBoxService.show('Hier steht eine kleine Nachricht mit dem was gerade passiert ist.','success');
            $rootScope.lxToastBoxAnimated = false;
        };

        $rootScope.openMsgAnimated = function(){
            $rootScope.lxMessageBoxAnimated = true;
            $rootScope.lxMessageBoxService.show('glyphicon glyphicon-trash','Delete Item','Soll das ausgewählte Item wirklich gelöscht werden?',[ 'ja','nein','vielleicht'],function(err,res){
                console.log('Error: ',err);
                console.log('Result: ',res);
                if(res==='ja'){
                    $rootScope.lxToastBoxAnimated = true;
                    $rootScope.lxToastBoxService.show('Item wurde erfolgreich gelöscht.','success');
                }
            });
        };
        $rootScope.openMsg = function(){
            $rootScope.lxMessageBoxAnimated = false;
            $rootScope.lxMessageBoxService.show('glyphicon glyphicon-trash','Delete Item','Soll das ausgewählte Item wirklich gelöscht werden?',[ 'ja','nein','vielleicht'],function(err,res){
                console.log('Error: ',err);
                console.log('Result: ',res);
            });
        };

    });

