'use strict';

describe('lxConfirm', function () {
    var scope, element;

    var fakeModal = {
        result: {
            then: function (confirmCallback) {
                // Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                this.confirmCallBack = confirmCallback;
            }
        },
        close: function () {
            // The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
            this.result.confirmCallBack();
        },
        dismiss: function () { }
    };

    beforeEach(module('ui.bootstrap'));
    beforeEach(module('lx.confirm'));

    beforeEach(inject(function ($modal) {
        spyOn($modal, 'open').andReturn(fakeModal);
    }));

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.delete = function () { };
        spyOn(scope, 'delete');

        element = angular.element('<a href="javascript:void(0)" lx-confirm="delete()" lx-confirm-title="Delete" lx-confirm-yes-text="Yes" lx-confirm-no-text="No" lx-confirm-message="Really?">Delete</a>');
        $compile(element)(scope);
    }));

    it('should initialize correctly', function () {
        var elementScope = element.isolateScope();

        expect(elementScope.lxConfirmMessage).toBe('Really?');
        expect(elementScope.lxConfirmTitle).toBe('Delete');
        expect(elementScope.lxConfirmYesText).toBe('Yes');
        expect(elementScope.lxConfirmNoText).toBe('No');
    });

    it('should cancel the dialog when dismiss is called', function () {
        // handle phantomjs error case
        if (element[0].click) {
            element[0].click();
            fakeModal.dismiss('cancel');
            expect(scope.delete).not.toHaveBeenCalled();
        }
    });

    it('should call delete when the dialog is closed', function () {
        // handle phantomjs error case
        if (element[0].click) {
            element[0].click();
            fakeModal.close();
            expect(scope.delete).toHaveBeenCalled();
        }
    });
});
