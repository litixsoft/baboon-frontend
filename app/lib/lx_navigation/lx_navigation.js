'use strict';

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

        this.$get = function (){
            var pub = {};
            /**
             * @ngdoc method
             * @name lx.navigation.$lxNavigation#getNavigation
             * @methodOf lx.navigation.$lxNavigation
             *
             * @description
             * ...
             *
             * @param {string} name - The name of the navigation for example standard.
             * @param {function(error, data) } callback - The callback.
             */
            pub.getNavigation = function(name, callback){
                if(config.navigation && config.navigation.hasOwnProperty(name)){
                    callback(null,config.navigation[name]);
                } else {
                    if(!config.navigation){
                        console.error('No Navigation defined. Please define a navigation with the help of the $lxTransportProvider in the config section of your app.');
                    } else {
                        console.error('Your defined nav-link-list "'+name+'" is not defined!');
                    }

                    callback('not existing');
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
  .directive('lxComNav', function ($location, ACTIVE_APP, $http, $templateCache, $compile,$lxNavigation) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        orientation: '@',
        navLinklist: '@',
        navTemplatePath: '='
      },
      link: function (scope, element) {

          var tplContent =  '<ul class="nav navbar-nav">'+
                                '<li ng-repeat="item in menu" ng-class="{active: isActive(item.route)}">'+
                                    '<a ui-sref="{{item.state}}" ng-show="isActiveApp(item.app)">{{item.title}}</a>'+
                                    '<a href="{{item.route}}" target="_self" ng-show="!isActiveApp(item.app)">{{item.title}}</a>'+
                                '</li>'+
                            '</ul>';

          function replaceWithStandard(template){
              element.replaceWith($compile(template)(scope));
          }

          if(scope.navTemplatePath && scope.navTemplatePath.length > 3){
              $http.get(scope.navTemplatePath, {cache: $templateCache})
                  .success(function(tplGetContent){
                      if(tplGetContent.substr(0,5)!== '<!doc'){
                          replaceWithStandard(tplGetContent);
                      } else {
                          replaceWithStandard(tplContent);
                      }
                  })
                  .error(function(){
                      replaceWithStandard(tplContent);
                  });
          } else {
              replaceWithStandard(tplContent);
          }

        var orientation = scope.orientation || 'horizontal';
        element.toggleClass('nav-stacked', orientation === 'vertical');

          $lxNavigation.getNavigation(scope.navLinklist,function(error,daten){
              if(daten){
                  scope.menu = daten;
              } else {
                  scope.menu = [];
              }
          });

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
  .directive('lxComNavTree', function ($location, $templateCache, ACTIVE_APP, $http, $compile, $lxNavigation) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        navLinklist: '@',
        navTemplatePath: '='
      },
      link: function (scope, element) {

          var tplContent =  '<ul class="navlist">'+
                                '<li ng-repeat="data in navList" ng-include="\'lx_navigation/standard/nav_tree_inside\'">'+
                                '</li>'+
                            '</ul>';

          $templateCache.put('lx_navigation/standard/nav_tree_inside', '<div class="list-item" ng-class="{active: isActive(data.route)}">'+
              '<div class="opensub {{data.hide}}" ng-show="data.children" ng-click="toggleShow(data)"></div>'+
                '<div class="nav-icon {{data.icon}}"></div>'+
                '<a ng-if="data.route && isActiveApp(data.app)" ng-class="{spacer: data.children.length > 0}" ng-href="{{data.route}}"><span>{{data.title}}</span></a>'+
                '<a ng-if="data.route && !isActiveApp(data.app)" ng-class="{spacer: data.children.length > 0}" ng-href="{{data.route}}" target="_self"><span>{{data.title}}</span></a>'+
                '<a ng-if="!data.route" ng-class="{spacer: data.children.length > 0}" ng-click="toggleShow(data);" style="cursor:pointer;"><span>{{data.title}}</span></a>'+
              '</div>'+
              '<ul class="display {{data.hide}}" ng-if="data.children.length">'+
                '<li ng-repeat="data in data.children" ng-include="\'lx_navigation/standard/nav_tree_inside\'"></li>'+
              '</ul>');

          function replaceWithStandard(template){
              element.replaceWith($compile(template)(scope));
          }

          if(scope.navTemplatePath && scope.navTemplatePath.length > 3){
              $http.get(scope.navTemplatePath, {cache: $templateCache})
                  .success(function(tplGetContent){
                      if(tplGetContent.substr(0,5)!== '<!doc'){
                          replaceWithStandard(tplGetContent);
                      } else {
                          replaceWithStandard(tplContent);
                      }
                  })
                  .error(function(){
                      replaceWithStandard(tplContent);
                  });
          } else {
              replaceWithStandard(tplContent);
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

          $lxNavigation.getNavigation(scope.navLinklist,function(error,daten){
              if(daten){
                  scope.navList = daten;
              } else {
                  scope.navList = [];
              }
          });

        if (scope.navList.length !== 0) {
          angular.forEach(scope.navList, function (value) {
            if (value.app === scope.app) {
              value.hide = 'nav-open';
            }
          });
          scope.openAll(scope.navList);
        }
      }
    };
  });
