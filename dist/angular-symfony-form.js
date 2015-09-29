(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FormValidationProvider = (function () {
    function FormValidationProvider() {
        _classCallCheck(this, FormValidationProvider);

        this.separator = '__';
    }

    _createClass(FormValidationProvider, [{
        key: 'setSeparator',
        value: function setSeparator(s) {
            var r = new RegExp('^[^a-z0-9]+$', 'i');
            if (false === r.test(s)) {
                throw new Error('Invalid separator');
            }
            this.separator = s;
        }
    }, {
        key: 'getSeparator',
        value: function getSeparator() {
            return this.separator;
        }
    }, {
        key: '$get',
        value: function $get() {
            var valid = true;
            var errors = undefined;
            var name = undefined;
            var items = [];
            var separator = this.separator;

            function _parse(e) {
                var result = {};
                var i = undefined;
                for (i in e) {
                    if ('children' === i) {
                        result = _parse(e[i]);
                        break;
                    } else if ('errors' === i) {
                        result = e[i];
                        valid = false;
                        break;
                    } else {
                        result[i] = e[i].length === 0 ? null : _parse(e[i]);
                    }
                }
                return result;
            }

            return {
                setErrors: function setErrors(e) {
                    if (!e) {
                        errors = undefined;
                        return;
                    }
                    errors = _parse(e);
                },
                getErrors: function getErrors(itemName) {
                    if (itemName) {
                        var path = itemName.split(separator);
                        var x = 0;
                        var xSize = path.length;
                        var err = angular.copy(errors);
                        for (; x < xSize; x++) {
                            if (err && err[path[x]]) {
                                err = err[path[x]];
                            }
                        }
                        return angular.isArray(err) ? err : [];
                    }
                    return errors;
                },
                setName: function setName(n) {
                    if (!n || false === angular.isString(n)) {
                        throw new Error('Invalid form name');
                    }
                    name = n;
                },
                getName: function getName() {
                    return name;
                },
                addItem: function addItem(i) {
                    if (!i || false === angular.isString(i)) {
                        throw new Error('Invalid item');
                    }
                    if (items.indexOf(i) !== -1) {
                        throw new Error('Item already exists');
                    }
                    items.push(i);
                },
                setItems: function setItems(i) {
                    if (!i || false === angular.isArray(i)) {
                        throw new Error('Invalid items');
                    }
                    var x = 0;
                    var size = i.length;
                    for (; x < size; x++) {
                        this.addItem(i[x]);
                    }
                },
                getItems: function getItems() {
                    return items;
                },
                isValid: function isValid() {
                    return valid;
                },
                updateScope: function updateScope(scope) {
                    var _this = this;

                    var err = undefined;
                    scope[name].$setDirty(valid === false);
                    angular.forEach(items, function (itemName) {
                        err = _this.getErrors(itemName);
                        angular.forEach(err, function (e) {
                            scope[name][itemName].$setValidity(e, false);
                        });
                    });
                }
            };
        }
    }]);

    return FormValidationProvider;
})();

exports['default'] = FormValidationProvider;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _formValidationProvider = require('./form-validation.provider');

var _formValidationProvider2 = _interopRequireDefault(_formValidationProvider);

angular.module('symfony-form', []).provider('FormValidation', _formValidationProvider2['default']);

},{"./form-validation.provider":1}]},{},[2]);
