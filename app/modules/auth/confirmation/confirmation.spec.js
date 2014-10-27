'use strict';

describe('auth', function () {
    var scope, $httpBackend, baseUri, $location;

    beforeEach(module('common.auth'));
    beforeEach(module('auth'));
    beforeEach(module('auth.confirmation'));

    describe('AuthConfirmationCtrlTest', function () {
        beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, BASE_URI, _$location_) {
            scope = $rootScope.$new();
            $location = _$location_;
            $controller('AuthConfirmationCtrl', {$scope: scope, $routeParams: {id: '1'}, $location: $location});
            $httpBackend = _$httpBackend_;
            baseUri = BASE_URI;
            //$httpBackend.expectGET(baseUri + 'auth/account/confirmation/1').respond(200, '');
        }));

        it('should be initialized correctly', function () {
            expect(typeof scope.renew).toBe('function');
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

        describe('has function for initial load', function () {
            it('should show success message', function () {
                $httpBackend.expectGET(baseUri + 'auth/account/confirmation/1').respond(200, '');
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('success');
                expect(scope.success).toBeTruthy();
            });

            it('should show 404 message', function () {
                $httpBackend.expectGET(baseUri + 'auth/account/confirmation/1').respond(404, '');
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('danger');
            });

            it('should show 409 message', function () {
                $httpBackend.expectGET(baseUri + 'auth/account/confirmation/1').respond(409, '');
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('danger');
                expect(scope.isExpired).toBeTruthy();
            });

            it('should show an generic error for all errors except 404 and 409', function () {
                $httpBackend.expectGET(baseUri + 'auth/account/confirmation/1').respond(500, '');
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('danger');
            });
        });

        describe('has a function renew() which', function () {
            it('should show a success message', function () {
                $httpBackend.expectGET(baseUri + 'auth/account/confirmation/1').respond(200, '');
                $httpBackend.flush();

                $httpBackend.expectPOST(baseUri + 'auth/account/renew').respond(200, '');
                scope.renew();
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('success');
            });

            it('should show an error message', function () {
                $httpBackend.expectGET(baseUri + 'auth/account/confirmation/1').respond(200, '');
                $httpBackend.flush();

                $httpBackend.expectPOST(baseUri + 'auth/account/renew').respond(500, '');
                scope.renew();
                $httpBackend.flush();

                expect(scope.alerts.length).toBe(1);
                expect(scope.alerts[0].type).toBe('danger');
            });
        });
    });
});
