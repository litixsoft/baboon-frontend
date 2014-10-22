'use strict';

describe('auth', function () {
    var scope, $httpBackend, baseUri, $window;

    beforeEach(module('auth'));
    beforeEach(module('auth.services'));
    beforeEach(module('auth.login'));

    describe('AuthLoginCtrlTest', function () {
        beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$window_, BASE_URI) {
            $window = {
                // now, $window.location.path will update that empty object
                location: {},
                // we keep the reference to window.document
                document: window.document,
                sessionStorage: {}
            };

            scope = $rootScope.$new();
            $controller('AuthLoginCtrl', {$scope: scope, $window: $window});
            $httpBackend = _$httpBackend_;
            baseUri = BASE_URI;
        }));

        it('should be initialized correctly', function () {
            expect(typeof scope.login).toBe('function');
            expect(typeof scope.closeAlert).toBe('function');
            expect(typeof scope.alerts).toBe('object');
        });

        describe('has a function closeAlert() which', function () {
            it('should close an alert', function () {
                scope.alerts = [
                    {type: 'danger', msg: 'error'}
                ];
                scope.closeAlert(0);
                expect(scope.alerts.length).toBe(0);
            });
        });

        describe('has a function login() which', function () {
            var testData = {email: 'foo@bar.com', password: 'passwword'};

            it('should return if form is invalid', function () {
                scope.form = {$invalid: true};
                scope.alerts = [
                    {type: 'danger', msg: 'error'}
                ];

                scope.login(testData);

                expect(scope.alerts.length).toBe(0);
            });

            it('should show success message', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/login', testData).respond(200, 'TestToken');
                scope.form = {$invalid: false};

                scope.login(testData);
                $httpBackend.flush();

                //expect($window.sessionStorage.token).toBeDefined();
                //expect($window.sessionStorage.token).toBe('TestToken');
                expect($window.location.href).toBe('/main/home');
            });

            it('should set form errors', function () {
                var $setValidityName = '';
                var $setValidityValid = null;

                $httpBackend.expectPOST(baseUri + 'auth/account/login', testData).respond(422, [
                    {property: 'email', message: 'Error message from test'}
                ]);
                scope.form = {
                    $invalid: false,
                    email: {
                        $setValidity: function (name, valid) {
                            $setValidityName = name;
                            $setValidityValid = valid;
                        },
                        $error: {}
                    }
                };

                scope.login(testData);
                $httpBackend.flush();

                expect(scope.form.email.$error.serverMsg).toBeDefined();
                expect(scope.form.email.$error.serverMsg).toBe('Error message from test');
                expect($setValidityName).toBe('server');
                expect($setValidityValid).toBe(false);
            });

            it('should show 404 message', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/login', testData).respond(404, '');
                scope.form = {$invalid: false};

                scope.login(testData);
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].msg).toBeDefined();
            });

            it('should show 403 message', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/login', testData).respond(403, '');
                scope.form = {$invalid: false};

                scope.login(testData);
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].msg).toBeDefined();
            });

            it('should show an generic error for all errors except 400 and 401', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/login', testData).respond(500, '');
                scope.form = {$invalid: false};

                scope.login(testData);
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].msg).toBeDefined();
            });
        });
    });

//    describe('LogoutServiceTest', function () {
//        var service, $window;
//
//        beforeEach(function () {
//            inject(function ($injector, _$window_) {
//                $window = _$window_;
//                $window.sessionStorage.token = 'TestToken';
//                service = $injector.get('LogoutService');
//            });
//        });
//
//        describe('test route call', function() {
//            it('should logout the user', function() {
//                inject(function ($rootScope, _$location_) {
//                    $rootScope.$apply(function(){
//                        _$location_.path('/auth/logout');
////                        $state.go('logout');
//                    });
//
//                    expect(_$location_.path()).toBe('/auth/logout');
//                    expect($window.sessionStorage.token).not.toBeDefined();
//                });
//            });
//        });
//    });
});
