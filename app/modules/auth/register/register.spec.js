'use strict';

describe('auth', function () {
    var ctrl, scope, $httpBackend, baseUri, $location;

    beforeEach(module('auth'));
    beforeEach(module('auth.services'));
    beforeEach(module('auth.register'));

    describe('AuthRegisterCtrl', function () {
        beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$location_, BASE_URI) {
            scope = $rootScope.$new();
            ctrl = $controller('AuthRegisterCtrl', {$scope: scope});
            $httpBackend = _$httpBackend_;
            baseUri = BASE_URI;
            $location = _$location_;
        }));

        it('should be initialized correctly', function () {
            expect(typeof scope.register).toBe('function');
            expect(typeof scope.closeAlert).toBe('function');
            expect(typeof scope.alerts).toBe('object');
        });

        describe('has a function closeAlert() which', function () {
            it('should close an alert', function () {
                scope.alerts = [{ type: 'danger', msg: 'error' } ];
                scope.closeAlert(0);
                expect(scope.alerts.length).toBe(0);
            });
        });

        describe('has a function register() which', function () {
            var testData = { firstname: 'foo', lastname: 'bar', email: 'foo@bar.com', password: 'passwword', password2: 'passwword' };

            it('should return if form is invalid', function () {
                scope.form = { $invalid: true };
                scope.alerts = [ { msg: 'error'} ];

                scope.register(testData);

                expect(scope.alerts.length).toBe(0);
            });

            it('should show success message', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/register', testData).respond(200, '');
                scope.form = { $invalid: false };

                scope.register(testData);
                $httpBackend.flush();
            });

            it('should set form errors', function () {
                var $setValidityName = '';
                var $setValidityValid = null;

                $httpBackend.expectPOST(baseUri + 'auth/account/register', testData).respond(422 [
                    { property: 'email', message: 'Error message from test'}
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

                scope.register(testData);
                $httpBackend.flush();

                expect(scope.form.email.$error.serverMsg).toBeDefined();
                expect(scope.form.email.$error.serverMsg).toBe('Error message from test');
                expect($setValidityName).toBe('server');
                expect($setValidityValid).toBe(false);
            });

            it('should show an generic error for all errors except 400 and 401', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/register', testData).respond(500, '');
                scope.form = { $invalid: false };

                scope.register(testData);
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].msg).toBeDefined();
            });
        });
    });
});