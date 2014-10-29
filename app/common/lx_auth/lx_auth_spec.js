'use strict';

describe('Auth service', function () {
    var service, window, $httpBackend;
    var testUser = {
        token: 'myToken',
        roles: ['User', 'Guest'],
        acl: ['register', 'login', 'getAllUsers'],
        name: 'wayne'
    };

    beforeEach(function () {
        module('common.auth');
    });

    describe('Auth', function () {
        beforeEach(function () {
            inject(function ($injector, $window, _$httpBackend_) {
                service = $injector.get('Auth');
                window = $window;
                window.sessionStorage.user = JSON.stringify(testUser);
                $httpBackend = _$httpBackend_;
            });
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('.rightsEnabled()', function () {
            it('should return true when there is an acl', function () {
                expect(service.rightsEnabled()).toBeTruthy();
            });

            it('should return false when there is no acl', function () {
                window.sessionStorage.user = JSON.stringify({name: 'test'});
                expect(service.rightsEnabled()).toBeFalsy();
            });

            it('should return false when there is no user', function () {
                window.sessionStorage.user = null;
                expect(service.rightsEnabled()).toBeFalsy();
            });

            it('should return false if there an empty user', function () {
                window.sessionStorage.user = '';
                expect(service.rightsEnabled()).toBeFalsy();
            });
        });

        describe('.userIsLoggedIn()', function () {
            it('should return true when there is a token', function () {
                expect(service.userIsLoggedIn()).toBeTruthy();
            });

            it('should return false when there is no token', function () {
                window.sessionStorage.user = JSON.stringify({name: 'test'});
                expect(service.userIsLoggedIn()).toBeFalsy();
            });

            it('should return false when there is no user', function () {
                window.sessionStorage.user = null;
                expect(service.userIsLoggedIn()).toBeFalsy();
            });

            it('should return false when there is an empty user', function () {
                window.sessionStorage.user = '';
                expect(service.userIsLoggedIn()).toBeFalsy();
            });
        });

        describe('.getAcl()', function () {
            it('should return true when there is an acl', function () {
                expect(service.getAcl()).toEqual(testUser.acl);
            });

            it('should return false when there is no acl', function () {
                window.sessionStorage.user = JSON.stringify({name: 'test'});
                expect(service.getAcl()).toBeUndefined();
            });

            it('should return false when there is no user', function () {
                window.sessionStorage.user = null;
                expect(service.getAcl()).toBeUndefined();
            });

            it('should return false if there an empty user', function () {
                window.sessionStorage.user = '';
                expect(service.getAcl()).toBeUndefined();
            });
        });

        describe('.getUser()', function () {
            it('should return the user from sessionStorage', function () {
                expect(window.sessionStorage.user).toBe(JSON.stringify(testUser));
                expect(service.getUser()).toEqual(testUser);
            });

            it('should return the user from cache', function () {
                expect(window.sessionStorage.user).toBe(JSON.stringify(testUser));
                expect(service.getUser()).toEqual(testUser);
                expect(service.getUser()).toEqual(testUser);
            });
        });

        describe('.login()', function () {
            it('should return the user with token when the login was successful', function () {
                var result = {token: 'TestToken', name: '123'};
                $httpBackend.expectPOST('auth/account/login', testUser).respond(200, result);

                service.login(testUser).success(function () {
                    expect(window.sessionStorage.user).toBe(JSON.stringify(result));
                });

                $httpBackend.flush();
            });

            it('should return an empty user object when the login was successful but the data is empty', function () {
                var result = null;
                $httpBackend.expectPOST('auth/account/login', testUser).respond(200, result);

                service.login(testUser).success(function () {
                    expect(window.sessionStorage.user).toBe(JSON.stringify({}));
                });

                $httpBackend.flush();
            });

            it('should return an error when the login failed', function () {
                var result = {message: 'login error'};
                $httpBackend.expectPOST('auth/account/login', testUser).respond(404, result);

                service.login(testUser).error(
                    function (err, status) {
                        expect(err).toBeDefined();
                        expect(err.message).toBe(result.message);
                        expect(status).toBe(404);
                    });

                $httpBackend.flush();
            });

            it('should return an error when the login was successful but the user cannot be parsed', function () {
                var result = {};
                var mary = {};
                result.sister = mary;
                mary.brother = result;

                $httpBackend.expectPOST('auth/account/login', testUser).respond(200, result);

                service.login(testUser).error(
                    function (err, status) {
                        expect(err).toBeDefined();
                        expect(err.message).toBe('Error parsing data from server');
                        expect(status).toBe(400);
                    });

                $httpBackend.flush();
            });
        });

        describe('.confirmation()', function () {
            it('should return success when the confirmation was successful', function () {
                $httpBackend.expectGET('auth/account/confirmation/1').respond(200, {});

                service.confirmation(1).success(function () {
                    expect(true).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should return an error when the confirmation failed', function () {
                var result = {message: 'confirmation error'};
                $httpBackend.expectGET('auth/account/confirmation/2').respond(404, result);

                service.confirmation(2).error(
                    function (err, status) {
                        expect(err).toBeDefined();
                        expect(err.message).toBe(result.message);
                        expect(status).toBe(404);
                    });

                $httpBackend.flush();
            });
        });

        describe('.renew()', function () {
            it('should return success when the renew was successful', function () {
                $httpBackend.expectPOST('auth/account/renew', function (data) {
                    expect(data).toBe('id=1&url=someUrl');
                    return true;
                }, function (headers) {
                    expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
                    return true;
                }).respond(200, {});

                service.renew(1, 'someUrl').success(function () {
                    expect(true).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should return an error when the renew failed', function () {
                var result = {message: 'renew error'};
                $httpBackend.expectPOST('auth/account/renew', function (data) {
                    expect(data).toBe('id=2&url=anotherURL');
                    return true;
                }, function (headers) {
                    expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
                    return true;
                }).respond(404, result);

                service.renew(2, 'anotherURL').error(
                    function (err, status) {
                        expect(err).toBeDefined();
                        expect(err.message).toBe(result.message);
                        expect(status).toBeUndefined();
                    });

                $httpBackend.flush();
            });
        });

        describe('.register()', function () {
            it('should return success when register was successful', function () {
                $httpBackend.expectPOST('auth/account/register', function (data) {
                    expect(data).toBe(JSON.stringify(testUser));
                    return true;
                }).respond(200, {});

                service.register(testUser).success(function () {
                    expect(true).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should return an error when the register failed', function () {
                var result = {message: 'register error'};
                $httpBackend.expectPOST('auth/account/register').respond(404, result);

                service.register(testUser).error(
                    function (err, status) {
                        expect(err).toBeDefined();
                        expect(err.message).toBe(result.message);
                        expect(status).toBe(404);
                    });

                $httpBackend.flush();
            });
        });

        describe('.logout', function () {
            it('should delete the user data from sessionStorage', function () {
                expect(window.sessionStorage.user).toBe(JSON.stringify(testUser));

                service.logout();

                expect(window.sessionStorage.user).toBeUndefined();
            });
        });

        describe('.password()', function () {
            it('should return success when password was successful', function () {
                $httpBackend.expectPOST('auth/account/password', function (data) {
                    expect(data).toBe(JSON.stringify(testUser));
                    return true;
                }).respond(200, {});

                service.password(testUser).success(function () {
                    expect(true).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should return an error when the password failed', function () {
                var result = {message: 'password error'};
                $httpBackend.expectPOST('auth/account/password').respond(404, result);

                service.password(testUser).error(
                    function (err, status) {
                        expect(err).toBeDefined();
                        expect(err.message).toBe(result.message);
                        expect(status).toBe(404);
                    });

                $httpBackend.flush();
            });
        });
    });
});
