'use strict';

angular.module('common.navigation',[])
    .constant('NAVOBJ',{
        standard :
            [
                {
                    'title': 'Home',
                    'route': '/main/home',
                    'app': 'main',
                    'children': [
                        {
                            'title': 'About',
                            'route': '/main/about',
                            'app': 'main'//,
//                            'children': [
//                                {
//                                    'title': 'Imprint',
//                                    'route': '/main/about/imprint',
//                                    'app': 'main'
//                                }
//                            ]
                        },
                        {
                            'title': 'Contact',
                            'route': '/main/contact',
                            'app': 'main'
                        }
                    ]
                },
                {
                    'title': 'Admin',
                    'route': '/admin/home',
                    'app': 'admin'
                }
            ],
        nav1:[
            {
                'title': 'About',
                'route': '/main/about',
                'app': 'main',
                'children': [
                    {
                        'title': 'Home',
                        'route': '/main/home',
                        'app': 'main'
                    }
                ]
            },
            {
                'title': 'Contact',
                'route': '/main/contact',
                'app': 'main'
            }
        ]
    })
    .provider('$comNavProvider', function () {
        var app;
        var route;
        var navList;
        var navTree;

        var addNavTreeObj = function (value) {

            var navObj = {
                title: value.title,
                route: value.route,
                controller: value.controller,
                norouting: value.norouting || false,
                app: value.app
            };

            if (value.level === 0 && value.order) {
                navObj.order = value.order;
            }

            navObj.level = value.level;

            if (value.target) {
                navObj.target = value.target;
            }

            if (value.children) {
                navObj.children = [];
            }

            return navObj;
        };

        var addNavListObj = function (value) {

            var navObj = {
                title: value.title,
                route: value.route,
                controller: value.controller,
                norouting: value.norouting || false,
                app: value.app
            };

            if (value.level === 0 && value.order) {
                navObj.order = value.order;
            }

            navObj.level = value.level;

            if (value.target) {
                navObj.target = value.target;
            }

            return navObj;
        };

        var checkTreeNav = function (tmpNav, navTree, current, level, user) {

            level += 1;

            var i, max;

            for (i = 0, max = tmpNav.length; i < max; i += 1) {

//                var hasRight = rights.userHasAccessToController(user, tmpNav[i].controller);
                var hasRight = true;

                if (hasRight) {

                    // add deep level of tree
                    tmpNav[i].level = level;

                    // check is current app
                    if (tmpNav[i].app !== current) {

                        // when not current set target to _self
                        tmpNav[i].target = '_self';
                    }

                    if (i > 0 && !navTree[i - 1]) {
                        navTree[i -1] = addNavTreeObj(tmpNav[i]);

                        if (tmpNav[i].children) {
                            checkTreeNav(tmpNav[i].children, navTree[i -1].children, current, level, user);
                        }
                    }
                    else {
                        navTree[i] = addNavTreeObj(tmpNav[i]);

                        if (tmpNav[i].children) {
                            checkTreeNav(tmpNav[i].children, navTree[i].children, current, level, user);
                        }
                    }
                }
            }
        };

        var checkListNav = function (tmpNav, current, level, user) {

            level += 1;

//            lxHelpers.forEach(tmpNav, function (value) {
            angular.forEach(tmpNav, function (value) {

//                var hasRight = rights.userHasAccessToController(user, value.controller);
                var hasRight = true;

                if (hasRight) {

                    // add deep level of tree
                    value.level = level;

                    // check is current app
                    if (value.app !== current) {

                        // when not current set target to _self
                        value.target = '_self';
                    }

                    // push in flat list
                    navList.push(addNavListObj(value));

                    // when children call recursive function
                    if (value.children) {
                        checkListNav(value.children, current, level, user);
                    }
                }
            });
        };


        this.set = function (options) {
            options = options || {};

            app = options.app;
            route = options.route;
        };

        this.$get = function () {
            var pub = {};

            pub.getTree = function (list, data) {
                var tmpNav = list || [];
                var current = data.current || 'main';
                navTree = [];

                checkTreeNav(tmpNav, navTree, current, -1, {});

                return navTree;
            };

            pub.getList = function (list, data) {
                var tmpNav = list || [];
                var current = data.current || 'main';
                navList = [];

//                checkListNav(tmpNav, current, -1, request.session.user);
                checkListNav(tmpNav, current, -1, {});

                return navList;
            };

            pub.getTopList = function (list, data) {
                var tmpNav = list || [];
                var current = data.current || 'main';
                navList = [];


                angular.forEach(tmpNav, function (value) {
                    var hasRight = true;//rights.userHasAccessToController(request.session.user, value.controller);

                    if (hasRight) {

                        value.level = 0;

                        if (value.app !== current) {
                            value.target = '_self';
                        }

                        navList.push(addNavListObj(value));
                    }
                });

                return navList;
            };

            return pub;
        };
    })
    .directive('comNav', function($location, $comNavProvider, ACTIVE_APP, NAVOBJ) {
        return {
            restrict: 'E',
            replace: true,
            template:   '<ul class="nav nav-pills">' +
                            '<li ng-repeat="item in menu" ng-class="{active: isActive(item.route)}">' +
                                '<a ng-href="{{item.route}}" ng-show="isActiveApp(item.app)">{{item.title}}</a>' +
                                '<a ng-href="{{item.route}}" target="_self" ng-show="!isActiveApp(item.app)">{{item.title}}</a>' +
                            '</li>' +
                        '</ul>',

            scope: {
                orientation: '@',
                navLinklist: '@'
            },
            link: function (scope, element, attrs) {

                var defaults = {
                    top: { fn: 'getTopList', orientation: 'horizontal' },
//                    sub: { fn: 'getSubList', orientation: 'vertical' },
                    list: { fn: 'getList', orientation: 'vertical' }
                };

                var orientation = scope.orientation || defaults[attrs.type].orientation;
                element.toggleClass('nav-stacked', orientation === 'vertical');

                var fn = defaults[attrs.type].fn;
                var linkList = NAVOBJ[scope.navLinklist || 'standard'];
                scope.menu = $comNavProvider[fn](linkList,{current: scope.app});

                scope.isActiveApp = function (app) {
                    return app === ACTIVE_APP;
                };

                scope.isActive = function (route) {
                    return route === $location.path();
                };
            }
        };
    })
    .directive('comNavTree', function($comNavProvider, $location, $templateCache, ACTIVE_APP, NAVOBJ) {
        return {
            restrict: 'E',
            replace: true,
            template:   '<ul class="navlist">'+
                            '<li ng-repeat="data in navList"  ng-include="\'bbc/navigation/tpls/treeview/inner.html\'"></li>'+
                        '</ul>',
            scope: {
                navLinklist: '@'
            },
            link: function (scope) {

                $templateCache.put('bbc/navigation/tpls/treeview/inner.html',
                        '<div class="list-item" ng-class="{active: isActive(data.route)}">'+
                            '<div class="opensub {{data.hide}}" ng-show="data.children" ng-click="toggleShow(data)"></div>'+
                            '<div class="nav-icon {{data.icon}}"></div>'+
                            '<a ng-if="!data.norouting && isActiveApp(data.app)" ng-class="{spacer: data.children.length > 0}" ng-href="{{data.route}}"><span>{{data.title}}</span></a>'+
                            '<a ng-if="!data.norouting && !isActiveApp(data.app)" ng-class="{spacer: data.children.length > 0}" ng-href="{{data.route}}" target="_self"><span>{{data.title}}</span></a>'+
                            '<a ng-if="data.norouting" ng-class="{spacer: data.children.length > 0}" ng-click="openRedirect(data);" style="cursor:pointer;"><span>{{data.title}}</span></a>'+
                        '</div>'+
                        '<ul class="display {{data.hide}}" ng-if="data.children.length">'+
                            '<li ng-repeat="data in data.children" ng-include="\'bbc/navigation/tpls/treeview/inner.html\'"></li>'+
                        '</ul>');


                scope.app = ACTIVE_APP;


                scope.openAll = function(list) {
                    var found = false;
                    angular.forEach(list, function(value){
                        if(value.children) {
                            var openLink = scope.openAll(value.children);
                            if (openLink) {
                                value.hide = 'bbc-open';
                            }
                        }
                        if(value.route===$location.path()){
                            found=true;
                        }
                    });
                    return found;
                };

                scope.findFirstLink = function (list, _level){
                    var level =  _level || 0;
                    var childs = 0;

                    for(var link in list){
                        if(level===0){
                            level = list[link].level;
                        }
                        if(!list[link].norouting){
                            if(level === list[link].level){
                                return list[link].route;
                            } else {
                                childs++;
                            }
                        }
                    }
                    if(childs > 0){
                        return scope.findFirstLink(list, (level+1));
                    }
                };

                scope.openRedirect = function(list) {
                    var redirect = scope.findFirstLink(list.children);
                    var currentApp = ACTIVE_APP;
                    if(redirect){
                        list.hide = 'bbc-open';
                        if(list.app !== currentApp){
                            window.location = redirect;
                        } else {
                            $location.path(redirect);
                        }
                    } else {
                        window.location = '/';
                    }
                };

                scope.toggleShow = function (data) {
                    if (data.hide === 'bbc-close' || data.hide === undefined) {
                        data.hide = 'bbc-open';
                    } else {
                        data.hide = 'bbc-close';
                    }
                };

                scope.isActive = function (route) {
                    return route === $location.path();
                };

                scope.isActiveApp = function (app) {
                    return app === ACTIVE_APP;
                };

                var linkList = NAVOBJ[scope.navLinklist || 'standard'];
                scope.navList = $comNavProvider.getTree(linkList,{current: scope.app});
                if (scope.navList.length !== 0) {
                    angular.forEach(scope.navList,function(value){
                        if(value.app===scope.app){
                            value.hide = 'bbc-open';
                        }
                    });
                    scope.openAll(scope.navList);
                }
            }
        };
    });
