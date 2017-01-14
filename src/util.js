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
    }
};