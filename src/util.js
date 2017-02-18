var slice = Array.prototype.slice;

module.exports = {
    isDOM: ( typeof HTMLElement === 'object' ) ?
        function(obj){
            return obj instanceof HTMLElement;
        } :
        function(obj){
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        },
    isJQuery: function (obj) {
        return obj instanceof jQuery;
    },
    inherits: function(ctor, superCtor) {
        if (ctor === undefined || ctor === null)
            throw new TypeError('The constructor to `inherits` must not be ' +
                'null or undefined.');

        if (superCtor === undefined || superCtor === null)
            throw new TypeError('The super constructor to `inherits` must not ' +
                'be null or undefined.');

        if (superCtor.prototype === undefined)
            throw new TypeError('The super constructor to `inherits` must ' +
                'have a prototype.');

        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    }
};