'use strict';

angular.module('navigation', [])
  .constant('NAVIGATION', {

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
    standard: [
      {
        'title': 'Main',
        'app': 'main',
        'children': [
          {
            'title': 'Home',
            'route': '/main/home',
            'app': 'main'
          },
          {
            'title': 'Navigation Examples',
            'route': '/main/nav_example',
            'app': 'main'
          },
          {
            'title': 'About',
            'route': '/main/about',
            'app': 'main'
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
    ]
  })
  .directive('lxComNav', function ($location, ACTIVE_APP, NAVIGATION,$http, $templateCache, $compile) {
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

          if(scope.navTemplatePath && scope.navTemplatePath.length > 3){
              $http.get(scope.navTemplatePath , {cache: $templateCache})
                  .success(function(tplGetContent){
                    element.replaceWith($compile(tplGetContent)(scope));
                  })
                  .error(function(){
                      element.replaceWith($compile(tplContent)(scope));
                  });
          } else {
            element.replaceWith($compile(tplContent)(scope));
          }

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
  .directive('lxComNavTree', function ($location, $templateCache, ACTIVE_APP, NAVIGATION, $http, $compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        navLinklist: '@',
        navTemplatePath: '='
      },
      link: function (scope, element) {

          var tplContent =  '<h1>Test</h1><ul class="navlist">'+
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

          if(scope.navTemplatePath && scope.navTemplatePath.length > 3){
              $http.get(scope.navTemplatePath, {cache: $templateCache})
                  .success(function(tplGetContent){
                      element.replaceWith($compile(tplGetContent)(scope));
                  })
                  .error(function(){
                      element.replaceWith($compile(tplContent)(scope));
                  });
          } else {
              element.replaceWith($compile(tplContent)(scope));
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
