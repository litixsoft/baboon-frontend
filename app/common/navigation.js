'use strict';

angular.module('common.navigation', ['lx.navigation'])
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
  });
