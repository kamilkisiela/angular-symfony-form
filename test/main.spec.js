describe('symfony-form', function() {
    "use strict";
    var fixtureErrors = {
        "children": {
            "firstname": {
                "errors": ['unique']
            },
            "time": {
                "children": {
                    "start": [],
                    "end": []
                }
            }
        }
    };
    var FormValidationProvider;
    var FormValidation;
    var $rootScope;
    var $compile;

    beforeEach(function () {
        angular.module('symfony-formMock', [])
            .config(function (_FormValidationProvider_) {
                FormValidationProvider = _FormValidationProvider_;
            });
        module('symfony-form', 'symfony-formMock');
        inject(function (_$rootScope_, _$compile_) {
            FormValidation = FormValidationProvider.$get();
            $rootScope = _$rootScope_;
            $compile = _$compile_;
        });
    });
    describe('scope changes', function () {
        var scope;
        var element;
        beforeEach(function () {
            scope = $rootScope.$new();
            scope.time = {
                start: null,
                end: null
            };
            scope.firstname = null;
            FormValidation.setName('test');
            FormValidation.setItems(['firstname', 'time__start', 'time__end']);
            element = '<div><form name="test">' +
                '<input name="firstname" value="" ng-model="firstname" required unique/>' +
                '<input name="time__start" value="" ng-model="time.start"/>' +
                '<input name="time__end" value="" ng-model="time.end" required/>' +
                '</form></div>';
            element = $compile(element)(scope);
            scope.$digest();
        });
        it('should be able to update scope', function () {
            var elm = angular.element(element);
            scope.firstname = "asd";
            scope.$digest();
            // set errors
            FormValidation.setErrors(fixtureErrors);
            FormValidation.updateScope(scope);
            scope.$digest();
            // firstname to be asd
            expect(elm[0].querySelector('[name=firstname]').value).toBe('asd');
            // invalid firstname [unique]
            expect(scope.test.firstname.$valid).toBeFalsy();
            expect(scope.test.firstname.$error).toEqual({unique: true});
            // valid time.start
            expect(scope.test.time__start.$valid).toBeTruthy();
            expect(scope.test.time__start.$error).toEqual({});
            // invalid time.end [required]
            expect(scope.test.time__end.$valid).toBeFalsy();
            expect(scope.test.time__end.$error).toEqual({required: true});
            expect(scope.test.$valid).toBeFalsy();
        });
    });
});