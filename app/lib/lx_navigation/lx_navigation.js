'use strict';

angular.module('lx.navigation', [])

  .directive('comNav', function ($location, ACTIVE_APP, NAVIGATION) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'assets/includes/navigation_list.html',

      scope: {
        orientation: '@',
        navLinklist: '@'
      },
      link: function (scope, element) {

        var orientation = scope.orientation || 'horizontal';
        element.toggleClass('nav-stacked', orientation === 'vertical');

        scope.menu = NAVIGATION[scope.navLinklist || 'standard'];

        scope.isActiveApp = function (app) {
          return app === ACTIVE_APP;
        };

        scope.isActive = function (route) {
          return route === $location.path();
        };
      }
    };
  })
  .directive('comNavTree', function ($location, $templateCache, ACTIVE_APP, NAVIGATION) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'assets/includes/navigation_tree_outside.html',
      scope: {
        navLinklist: '@'
      },
      link: function (scope) {

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


        scope.navList = NAVIGATION[scope.navLinklist || 'standard'];
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
