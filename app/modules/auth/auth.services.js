'use strict';

angular.module('auth.services', [])
    .factory('Auth', function ($http, $q, $window) {

        return {
            confirmation: function (id) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get('auth/account/confirmation/' + id).
                    success(function () {
                        deferred.resolve();
                    }).
                    error(function (err, status) {
                        deferred.reject({ data: err, status: status });
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };

                return promise;
            },
            renew: function (id, url) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http({ method: 'POST', url: 'auth/account/renew', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                        }
                        return str.join('&');
                    },
                    data: { id: id, url: url }
                })
                    .success(function () {
                        deferred.resolve();
                    })
                    .error(function () {
                        deferred.reject();
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };

                return promise;
            },
            register: function (user) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.post('auth/account/register', user, { type: 'application/json' })
                    .success(function () {
                        deferred.resolve();
                    })
                    .error(function (err, status) {
                        deferred.reject({ data: err, status: status });
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };

                return promise;
            },
            login: function (user) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.post('auth/account/login', user, { type: 'application/json' })
                    .success(function (data) {
                        $window.sessionStorage.token = data.token;
                        $window.sessionStorage.acl = JSON.stringify(data.userAcl || {});

                        deferred.resolve();
                    })
                    .error(function (err, status) {
                        deferred.reject({ data: err, status: status });
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };

                return promise;
            },
            logout: function () {
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.acl;
            },
            password: function (user) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.post('auth/account/password', user, { type: 'application/json' })
                    .success(function () {
                        deferred.resolve();
                    }).
                    error(function (err, status) {
                        deferred.reject({ data: err, status: status });
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };

                return promise;
            }
        };
    });

