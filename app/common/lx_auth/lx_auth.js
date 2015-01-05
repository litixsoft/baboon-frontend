'use strict';

angular.module('common.auth', [])
    .factory('Auth', function ($http, $q, $window) {
        var currentUser;

        return {
            confirmation: function (id) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.get('auth/account/confirmation/' + id)
                    .success(deferred.resolve)
                    .error(function (err, status) {
                        deferred.reject({data: err, status: status});
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, function (response) {
                        fn(response.data, response.status);
                    });
                    return promise;
                };

                return promise;
            },
            renew: function (id, url) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http({
                    method: 'POST',
                    url: 'auth/account/renew',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        angular.forEach(obj, function (value, key) {
                            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                        });
                        return str.join('&');
                    },
                    data: {id: id, url: url}
                })
                    .success(deferred.resolve)
                    .error(deferred.reject);

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

                $http.post('auth/account/register', user, {type: 'application/json'})
                    .success(deferred.resolve)
                    .error(function (err, status) {
                        deferred.reject({data: err, status: status});
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, function (response) {
                        fn(response.data, response.status);
                    });
                    return promise;
                };

                return promise;
            },
            login: function (user) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.post('auth/account/login', user, {type: 'application/json'})
                    .success(function (data) {
                        try {
                            $window.sessionStorage.user = JSON.stringify(data || {});
                            deferred.resolve();
                        } catch (error) {
                            deferred.reject({data: new Error('Error parsing data from server'), status: 400});
                        }
                    })
                    .error(function (err, status) {
                        deferred.reject({data: err, status: status});
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, function (response) {
                        fn(response.data, response.status);
                    });
                    return promise;
                };

                return promise;
            },
            logout: function () {
                delete $window.sessionStorage.user;
            },
            password: function (user) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.post('auth/account/password', user, {type: 'application/json'})
                    .success(deferred.resolve)
                    .error(function (err, status) {
                        deferred.reject({data: err, status: status});
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, function (response) {
                        fn(response.data, response.status);
                    });
                    return promise;
                };

                return promise;
            },
            getUser: function () {
                if (currentUser) {
                    return currentUser;
                }

                try {
                    currentUser = JSON.parse($window.sessionStorage.user || {});
                    return currentUser || {};
                } catch (error) {
                    return {};
                }
            },
            userIsLoggedIn: function () {
                return !!this.getUser().token;
            },
            rightsEnabled: function () {
                return !!this.getUser().acl;
            },
            getAcl: function () {
                return this.getUser().acl;
            },
            getRoles: function () {
                return this.getUser().roles;
            },
            userIsInRole: function (role) {
                return angular.isString(role) && (this.getRoles() || []).indexOf(role) > -1;
            },
            userHasAccess: function (right) {
                return angular.isString(right) && (this.getAcl() || []).indexOf(right) > -1;
            }
        };
    });

