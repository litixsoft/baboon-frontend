'use strict';

angular.module('common.auth', [])
    .factory('Auth', function ($http, $q, $window) {
        var currentUser;

        return {
            confirmation: function (id) {
                var deferred = $q.defer();

                $http.get('auth/account/confirmation/' + id)
                    .then(deferred.resolve)
                    .catch(function (response) {
                        deferred.reject({ error: response.data, status: response.status });
                    });
                return deferred.promise;
            },
            renew: function (id, url) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: 'auth/account/renew',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function (obj) {
                        var str = [];
                        angular.forEach(obj, function (value, key) {
                            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                        });
                        return str.join('&');
                    },
                    data: { id: id, url: url }
                })
                    .then(deferred.resolve)
                    .catch(function (response) {
                        deferred.reject({ error: response.data, status: response.status });
                    });
                return deferred.promise;
            },
            register: function (user) {
                var deferred = $q.defer();

                $http.post('auth/account/register', user, { type: 'application/json' })
                    .then(deferred.resolve)
                    .catch(function (response) {
                        deferred.reject({ error: response.data, status: response.status });
                    });
                return deferred.promise;
            },
            login: function (user) {
                var deferred = $q.defer();

                $http.post('auth/account/login', user, { type: 'application/json' })
                    .then(function (response) {
                        try {
                            $window.sessionStorage.user = JSON.stringify(response && response.data || {});
                            deferred.resolve();
                        } catch (error) {
                            deferred.reject({ error: new Error('Error parsing data from server'), status: 400 });
                        }
                    })
                    .catch(function (response) {
                        deferred.reject({ error: response.data, status: response.status });
                    });
                return deferred.promise;
            },
            logout: function () {
                delete $window.sessionStorage.user;
            },
            password: function (user) {
                var deferred = $q.defer();

                $http.post('auth/account/password', user, { type: 'application/json' })
                    .then(deferred.resolve)
                    .catch(function (response) {
                        deferred.reject({ error: response.data, status: response.status });
                    });
                return deferred.promise;
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
                return Boolean(this.getUser().token);
            },
            rightsEnabled: function () {
                return Boolean(this.getUser().acl);
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

