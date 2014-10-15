'use strict';

angular.module('admin.home', [])
    .config(function ($stateProvider) {
        $stateProvider.state('adminHome', {
            url: '/admin/home', templateUrl: '/modules/admin/home/home.html'
        });
    });
