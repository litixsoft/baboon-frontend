'use strict';

angular.module('examples', [
  'lx.navigation',
  'lx.layout',
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
                        title: 'Admin with a very long Title and ellipsis',
                        state: 'adminHome',
                        route: '/admin/home',
                        app: 'admin'
                    }
                ]
            }
        });
  })
    .run(function($rootScope, lxMessageBoxService, lxToastBoxService) {

        $rootScope.pathNav = 'assets/includes/nav_list.html';
        $rootScope.pathNavTree = 'assets/includes/nav_tree_outside.html';

        $rootScope.lxMessageBoxService = lxMessageBoxService;
        $rootScope.lxToastBoxService = lxToastBoxService;

        $rootScope.openToastAnimated = function(){
            console.log("Open Animated");
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
                console.log("Error: ",err);
                console.log("Result: ",res);
                if(res==='ja'){
                    $rootScope.lxToastBoxAnimated = true;
                    $rootScope.lxToastBoxService.show('Item wurde erfolgreich gelöscht.','success');
                }
            });
        };
        $rootScope.openMsg = function(){
            $rootScope.lxMessageBoxAnimated = false;
            $rootScope.lxMessageBoxService.show('glyphicon glyphicon-trash','Delete Item','Soll das ausgewählte Item wirklich gelöscht werden?',[ 'ja','nein','vielleicht'],function(err,res){
                console.log("Error: ",err);
                console.log("Result:",res);
            });
        };

    });

