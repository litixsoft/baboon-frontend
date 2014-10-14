'use strict';
angular.module('common.utils', [])
    .factory('lxUtils',
        function () {
            var pub = {};

            pub.populateServerErrors = function (array, form) {
                for (var i = 0; i < array.length; i++) {
                    form[array[i].property].$setValidity('server', false);
                    form[array[i].property].$error.serverMsg = array[i].message;
                }
            };

            return pub;
        });