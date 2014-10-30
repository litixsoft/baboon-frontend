'use strict';
/*eslint no-else-return:0 */

angular.module('lx.navigation', [])
/**
 * @ngdoc object
 * @name lx.navigation.$lxNavigation
 *
 * @description
 * Service for navigation. Gets or sets the navigation.
 *
 * For more information look at the [guide](/lx_navigation).
 *
 */
    .provider('$lxNavigation', function () {
        var config = {};

        function cloneNavObject (value) {
            return {
                title: value.title,
                route: value.route,
                app: value.app,
                state: value.state,
                roles: value.roles
            };
        }

        function userHasAccess (user, navItem) {
            if (!navItem.roles && !navItem.resources || !user) {
                return true;
            }

            if (navItem.roles && !navItem.resources) {
                if (user.roles) {
                    for (var x = 0; x < navItem.roles.length; x++) {
                        for (var y = 0; y < user.roles.length; y++) {
                            if (navItem.roles[x] === user.roles[y]) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            } else {
                if (user.acl) {
                    for (var z = 0; z < navItem.resources.length; z++) {
                        for (var w = 0; w < user.acl.length; w++) {
                            if (navItem.resources[z] === user.acl[w]) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            }
        }

        function getUserNavigation (navigation, currentApp, user) {
            var result = [];

            angular.forEach(navigation, function (navItem) {
                if (navItem.children) {
                    var childList = getUserNavigation(navItem.children, currentApp, user);
                    var val = cloneNavObject(navItem);
                    val.children = childList;

                    if (userHasAccess(user, val)) {
                        result.push(val);
                    }
                } else if (userHasAccess(user, navItem)) {
                    result.push(cloneNavObject(navItem));
                }
            });

            return result;
        }

        /**
         * @ngdoc method
         * @name lx.navigation.$lxNavigation#set
         * @methodOf lx.navigation.$lxNavigation
         *
         * @description
         * Setup the navigation configuration
         *
         * @param {object} options The options for config
         */
        this.set = function (options) {
            options = options || {};

            // default settings
            config.navigation = options.navigation;
        };

        this.$get = function ($log) {
            var pub = {};

            /**
             * @ngdoc method
             * @name lx.navigation.$lxNavigation#getNavigation
             * @methodOf lx.navigation.$lxNavigation
             *
             * @description
             * ...
             *
             * @param {object} data The name of the navigation object, the user acl, the current app
             * @returns {Array} The navigation
             */
            pub.getNavigation = function (data) {
                var currentApp = data.currentApp || 'main';

                if (config.navigation && config.navigation[data.navName]) {
                    return getUserNavigation(config.navigation[data.navName], currentApp, data.user);
                } else {
                    if (!config.navigation) {
                        $log.info('No Navigation defined. Please define a navigation with the help of the $lxTransportProvider in the config section of your app.');
                    } else {
                        $log.error('Your defined nav-link-list "' + data.navName + '" is not defined!');
                    }

                    return [];
                }
            };

            return pub;
        };
    })
/**
 * @ngdoc directive
 * @name lx.navigation.directive:lxComNav
 * @restrict E
 *
 * @description
 * Creates the navigation in a flat list.
 *
 * For more information look at the [guide](/lxComNav).
 *
 * @param {string=} orientation The orientation of the list, horizontal or vertical.
 * @param {string} navLinklist The list with all navigation links.
 * @param {object=} navTemplatePath The path to a template which should overwrite the standard layout.
 *
 */
    .directive('lxComNav', function ($location, ACTIVE_APP, $http, $templateCache, $compile, $lxNavigation) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                orientation: '@',
                navName: '@',
                navTemplatePath: '=',
                navUser: '='
            },
            link: function (scope, element) {

                var tplContent = '<ul class="nav navbar-nav">' +
                    '<li ng-repeat="item in menu">' +
                    '<div ng-if="item.state" ui-sref-active="active">'+
                    '<a ui-sref="{{item.state}}" ng-show="isActiveApp(item.app) && item.state">{{item.title}}</a>' +
                    '</div>' +
                    '<div ng-if="!item.state" ng-class="{active: isActive(item.route)}">' +
                    '<a href="{{item.route}}" ng-show="isActiveApp(item.app)">{{item.title}}</a>' +
                    '<a href="{{item.route}}" target="_self" ng-show="!isActiveApp(item.app)">{{item.title}}</a>' +
                    '</div>'+
                    '</li>' +
                    '</ul>';


                function replaceWithStandard (template) {
                    angular.forEach(scope.menu,function(key){
                        if(key.route && key.state){
                            console.error("Please use only one routing element in your navigation. Route or State, not both together!! ",key);
                            element.replaceWith($compile('<span style="color:red;padding:15px;">NAV ERROR</span>')(scope));
                            return false;
                        }
                    });
                    element.replaceWith($compile(template)(scope));
                }

                var orientation = scope.orientation || 'horizontal';
                element.toggleClass('nav-stacked', orientation === 'vertical');

                scope.menu = $lxNavigation.getNavigation({
                    currentApp: ACTIVE_APP,
                    navName: scope.navName,
                    user: scope.navUser
                });

                if (scope.navTemplatePath && scope.navTemplatePath.length > 3) {
                    $http.get(scope.navTemplatePath, {cache: $templateCache})
                        .success(function (tplGetContent) {
                            if (tplGetContent.substr(0, 5) !== '<!doc') {
                                replaceWithStandard(tplGetContent);
                            } else {
                                replaceWithStandard(tplContent);
                            }
                        })
                        .error(function () {
                            replaceWithStandard(tplContent);
                        });
                } else {
                    replaceWithStandard(tplContent);
                }

                scope.isActiveApp = function (app) {
                    return app === ACTIVE_APP;
                };

                scope.isActive = function (route) {
                    return route === $location.path();
                };
            }
        };
    })
/**
 * @ngdoc directive
 * @name lx.navigation.directive:lxComNavTree
 * @restrict E
 *
 * @description
 * Creates the navigation in a tree list.
 *
 * For more information look at the [guide](/lxComNavTree).
 *
 * @param {string} navLinklist The list with all navigation links.
 * @param {object=} navTemplatePath The path to a template which should overwrite the standard layout.
 *
 */
    .directive('lxComNavTree', function ($route, $location, $templateCache, ACTIVE_APP, $http, $compile, $lxNavigation) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                navName: '@',
                navTemplatePath: '=',
                navUser: '='
            },
            link: function (scope, element) {

                var tplContent = '<ul class="navlist">' +
                    '<li ng-repeat="data in navList" ng-include="\'lx_navigation/standard/nav_tree_inside\'" ng-hide="data.children && data.children.length===0">' +
                    '</li>' +
                    '</ul>';

                $templateCache.put('lx_navigation/standard/nav_tree_inside',
                        '<div ng-if="!data.state && data.route" class="list-item" ng-class="{active: isActive(data.route)}">' +
                        '<div class="opensub {{data.hide}}" ng-show="data.children" ng-click="toggleShow(data)"></div>' +
                        '<div class="nav-icon {{data.icon}}"></div>' +
                        '<a ng-if="data.route && isActiveApp(data.app)" ng-class="{spacer: data.children.length > 0}" ng-href="{{data.route}}"><span>{{data.title}}</span></a>' +
                        '<a ng-if="data.route && !isActiveApp(data.app)" ng-class="{spacer: data.children.length > 0}" ng-href="{{data.route}}" target="_self"><span>{{data.title}}</span></a>' +
                        '</div>' +
                        '<div ng-if="data.state && !data.route" class="list-item"  ui-sref-active="active">' +
                        '<div class="opensub {{data.hide}}" ng-show="data.children" ng-click="toggleShow(data)"></div>' +
                        '<div class="nav-icon {{data.icon}}"></div>' +
                        '<a ui-sref="{{data.state}}" ng-if="isActiveApp(data.app) && data.state"><span>{{data.title}}</span></a>' +
                        '</div>' +
                        '<div ng-if="!data.state && !data.route" class="list-item"  ui-sref-active="active">' +
                        '<div class="opensub {{data.hide}}" ng-show="data.children" ng-click="toggleShow(data)"></div>' +
                        '<div class="nav-icon {{data.icon}}"></div>' +
                        '<a ng-class="{spacer: data.children.length > 0}" ng-click="toggleShow(data);" style="cursor:pointer;"><span>{{data.title}}</span></a>' +
                        '</div>' +
                        '<ul class="display {{data.hide}}" ng-if="data.children.length">' +
                        '<li ng-repeat="data in data.children" ng-include="\'lx_navigation/standard/nav_tree_inside\'"></li>' +
                        '</ul>');

                function replaceWithStandard (template) {
                    angular.forEach(scope.navList,function(key){
                        if(key.route && key.state){
                            console.error("Please use only one routing element in your navigation. Route or State, not both together!! ",key);
                            element.replaceWith($compile('<span style="color:red;padding:15px;">NAV ERROR</span>')(scope));
                            return false;
                        }
                    });
                    element.replaceWith($compile(template)(scope));
                }

                scope.app = ACTIVE_APP;

                scope.openAll = function (list) {
                    var found = false;
                    angular.forEach(list, function (value) {
                        if (value.children) {
                            var openLink = scope.openAll(value.children);
                            if (openLink) {
                                value.hide = 'nav-open';
                            }
                        }
                        if (value.route === $location.path()) {
                            found = true;
                        }
                    });
                    return found;
                };

                scope.toggleShow = function (data) {
                    if (data.hide === 'nav-close' || data.hide === undefined) {
                        data.hide = 'nav-open';
                    } else {
                        data.hide = 'nav-close';
                    }
                };

                scope.isActive = function (route) {
                    return route === $location.path();
                };

                scope.isActiveApp = function (app) {
                    return app === ACTIVE_APP;
                };

                scope.navList = $lxNavigation.getNavigation({
                    currentApp: ACTIVE_APP,
                    navName: scope.navName,
                    user: scope.navUser
                });

                if (scope.navList.length !== 0) {
                    angular.forEach(scope.navList, function (value) {
                        if (value.app === scope.app) {
                            value.hide = 'nav-open';
                        }
                    });
                    scope.openAll(scope.navList);
                }

                if (scope.navTemplatePath && scope.navTemplatePath.length > 3) {
                    $http.get(scope.navTemplatePath, {cache: $templateCache})
                        .success(function (tplGetContent) {
                            if (tplGetContent.substr(0, 5) !== '<!doc') {
                                replaceWithStandard(tplGetContent);
                            } else {
                                replaceWithStandard(tplContent);
                            }
                        })
                        .error(function () {
                            replaceWithStandard(tplContent);
                        });
                } else {
                    replaceWithStandard(tplContent);
                }
            }
        };
    });
