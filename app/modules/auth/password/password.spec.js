'user strict';

describe('auth', function () {
    var ctrl, scope, $httpBackend, baseUri;

    beforeEach(module('auth'));
    beforeEach(module('auth.services'));
    beforeEach(module('auth.password'));

    describe('AuthPasswordCtrlTest', function() {
        beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, BASE_URI) {
            scope = $rootScope.$new();
            ctrl = $controller('AuthPasswordCtrl', {$scope: scope});
            $httpBackend = _$httpBackend_;
            baseUri = BASE_URI;
        }));

        it('should be initialized correctly', function () {
            expect(typeof scope.send).toBe('function');
            expect(typeof scope.closeAlert).toBe('function');
            expect(typeof scope.alerts).toBe('object');
        });

        describe('has a function closeAlert() which', function () {
            it('should close an alert', function () {
                scope.alerts = [{type: 'danger', msg: 'error'}];
                scope.closeAlert(0);
                expect(scope.alerts.length).toBe(0);
            });
        });

        describe('has a function send() which', function () {
            it('should return if form is invalid', function () {
                scope.form = { $invalid: true };
                scope.alerts = [{type: 'danger', msg: 'error'}];
                scope.requesting = false;

                scope.send({email: 'foo@bar.com'});

                expect(scope.requesting).toBeFalsy();
                expect(scope.alerts.length).toBe(0);
            });

            it('should show success message', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/password', { email: 'foo@bar.com' }).respond(201, '');
                scope.form = { $invalid: false };

                scope.send({email: 'foo@bar.com'});
                $httpBackend.flush();

                expect(scope.requesting).toBeFalsy();
                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('success');
            });

            it('should set form errors', function () {
                var $setValidityName = '';
                var $setValidityValid = null;

                $httpBackend.expectPOST(baseUri + 'auth/account/password', { email: 'foo@bar.com' }).respond(400, [{property: 'email', message: 'Error message from test'}]);
                scope.form = {
                    $invalid: false,
                    email: {
                        $setValidity: function(name, valid) {
                            $setValidityName = name;
                            $setValidityValid = valid;
                        },
                        $error: {}
                    }
                };

                scope.send({email: 'foo@bar.com'});
                $httpBackend.flush();

                expect(scope.requesting).toBeFalsy();
                expect(scope.form.email.$error.serverMsg).toBeDefined();
                expect(scope.form.email.$error.serverMsg).toBe('Error message from test');
                expect($setValidityName).toBe('server');
                expect($setValidityValid).toBe(false);
            });

            it('should show 404 message', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/password', { email: 'foo@bar.com' }).respond(404, '');
                scope.form = { $invalid: false };

                scope.send({email: 'foo@bar.com'});
                $httpBackend.flush();

                expect(scope.requesting).toBeFalsy();
                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('danger');
            });

            it('should show an generic error for all errors except 400 and 401', function () {
                $httpBackend.expectPOST(baseUri + 'auth/account/password', { email: 'foo@bar.com' }).respond(500, '');
                scope.form = { $invalid: false };

                scope.send({email: 'foo@bar.com'});
                $httpBackend.flush();

                expect(scope.requesting).toBeFalsy();
                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('danger');
            });
        });
    });
});