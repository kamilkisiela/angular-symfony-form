export default class FormValidationProvider {

    constructor() {
        this.separator = '__';
    }

    setSeparator(s) {
        var r = new RegExp('^[^a-z0-9]+$', 'i');
        if (false === r.test(s)) {
            throw new Error('Invalid separator');
        }
        this.separator = s;
    }

    getSeparator() {
        return this.separator;
    }

    $get() {
        let valid = true;
        let errors;
        let name;
        let items = [];
        let separator = this.separator;

        function _parse(e) {
            let result = {};
            let i;
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
            setErrors(e) {
                if (!e) {
                    errors = undefined;
                    return;
                }
                errors = _parse(e);
            },
            getErrors(itemName) {
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
            setName(n) {
                if (!n || false === angular.isString(n)) {
                    throw new Error('Invalid form name');
                }
                name = n;
            },
            getName() {
                return name;
            },
            addItem(i) {
                if (!i || false === angular.isString(i)) {
                    throw new Error('Invalid item');
                }
                if (items.indexOf(i) !== -1) {
                    throw new Error('Item already exists');
                }
                items.push(i);
            },
            setItems(i) {
                if (!i || false === angular.isArray(i)) {
                    throw new Error('Invalid items');
                }
                var x = 0;
                var size = i.length;
                for (; x < size; x++) {
                    this.addItem(i[x]);
                }
            },
            getItems(){
                return items;
            },
            isValid(){
                return valid;
            },
            updateScope(scope){
                let err;
                scope[name].$setDirty(valid === false);
                angular.forEach(items, (itemName) => {
                    err = this.getErrors(itemName);
                    angular.forEach(err, (e) => {
                        scope[name][itemName].$setValidity(e, false);
                    });
                });
            }
        };
    }
}

