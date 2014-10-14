'use strict';
angular.module('common.utils', [])
    .factory('lxUtils',
        function () {
            var pub = {};

            pub.populateServerErrors = function (array, form) {
                for (var i = 0; i < array.length; i++) {
                    var prop = array[i].property.toLowerCase();
                    form[prop].$setValidity('server', false);
                    form[prop].$error.serverMsg = array[i].message;
                }
            };

            return pub;
        });