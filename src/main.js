import FormValidationProvider from './form-validation.provider';

angular.module('symfony-form', [])
    .provider('FormValidation', FormValidationProvider);