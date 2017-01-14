var EventEmitter = require('EventEmitter');
var $ = require('jquery');
var Util = require('./util');

var SwitchTab = function(options){
    EventEmitter.call(this);

    this.data = [];
    this.curIndex = -1;
    options && this.init(options);
};

var proto = SwitchTab.prototype = new EventEmitter();

proto.defaultOptions = {
    tab: null,
    container: null,
    name: '',
    triggerEvent: 'click',
    beforSwitch: null,
    afterSwitch: null,
    onClass: 'on',
    enable: true
};

/** Extend the option merge by the defaultOptions and return a new option. */
proto.extendOption = function (option) {
    return $.extend({}, this.defaultOptions, option);
};
/**
 *  Get tab index.
 *  The target can be <the tab index> | <the tab name> | <the tab Element> |  <the tab jQuery Object> | object contain above value
 *  @param target Number|String|DOMElement|JqueryObject|Object.tab
 *  @return the target index in storage array
 */
proto.getIndex = function (target) {
    var index = -1;
    if($.isNumeric(target)){
        index = parseInt(target);
    } else if($.type(target) === 'string'){
        $.each(this.data, function (i, item) {
            if(item.name === target){
                index = i;
                return false;
            }
        }.bind(this));
    } else if(Util.isDOM(target) || Util.isJQuery(target)){
        target = target.get ? target.get(0) : target;
        $.each(this.data, function (i, item) {
            if(item.tab.get(0) === target){
                index = i;
                return false;
            }
        }.bind(this));
    } else if($.isPlainObject(target) && target.tab){
        return this.getIndex(target.tab);
    }
    return index;
};

/**
 *  Initialize the options
 *  @param options
 *  {
 *   tabs: Array<DOMElement|JqueryObject|JquerySelectors>,
 *   container: Array<DOMElement|JqueryObject|JquerySelectors>,
 *   names: Array<String>,
 *   triggerEvent: String,
 *   onClass: String
 *  }
 *  or
 *  [
 *   {
 *      tab: DOMElement|JqueryObject|JquerySelectors,
 *      container: DOMElement|JqueryObject|JquerySelectors,
 *      triggerEvent: String,
 *      onClass: String
 *   },
 *   ...
 *  ]
 */
proto.init = function(options){
    //this.reset();

    if($.isArray(options)) {
        $.each(options, function(i, option) {
            this.add(option);
        }.bind(this));
    } else if($.isPlainObject(options)){
        var tabs = options.tabs || [],
            containers = options.containers || [],
            names = options.names || [],
            option;

        delete options.tabs;
        delete options.containers;
        delete options.names;

        $.each(tabs, function(i, tab) {
            this.add($.extend(options, {
                tab: tab,
                container: containers[i],
                name: names[i] || ''
            }));
        }.bind(this));
    } else {
        throw 'parse options error:' + options;
    }

    this.to(0);
};

/**
 *  Add tab and container with index param to switchtab in its storage array.
 *  @param option {
 *      tab: DOMElement|JqueryObject|JquerySelectors,
 *      container: DOMElement|JqueryObject|JquerySelectors,
 *      triggerEvent: String,
 *      onClass: String
 *  }
 *  @param index Number. The index must between 0 and the storage array length. If out of the range, push it to the end
 */
proto.add = function(option, index){
    if(!option.tab || !option.container || this.getIndex(option.tab) != -1) return;
    option.tab = $(option.tab);
    option.container = $(option.container);
    option = this.extendOption(option);
    index = $.isNumeric(index) ? parseInt(index) : this.data.length;
    if(index < 0 || index > this.data.length){
        index = this.data.length;
    }
    this.data.splice(index, 0, option);
    option._triggerHandler = this.onTriggerTab.bind(this);
    option.tab.on(option.triggerEvent,option._triggerHandler).data('switch', option);
};

/**
 *  Switch to target tab
 *  @param target @see getIndex
 */
proto.to = function(target){
    var index = this.getIndex(target);
    if(index < 0 || index >= this.data.length || this.curIndex === index) return;

    var option = this.data[index];
    // before switch
    var flag = true;
    if($.isFunction(option.beforSwitch)){
        flag = option.beforSwitch.call(this);
    } else {
        flag = this.trigger('beforSwitch');
    }
    if(!flag) return;
    // do switch
    var i, len, item;
    for(i = 0, len = this.data.length; i < len; i++){
        item = this.data[i];
        item.tab.removeClass('on');
        item.container.hide();
    }
    item = this.data[index];
    item.tab.addClass('on');
    item.container.show();
    this.curIndex = index;
    // after switch
    if($.isFunction(option.afterSwitch)){
        option.afterSwitch.call(this);
    } else {
        this.trigger('afterSwitch');
    }
};

proto.onTriggerTab = function(event){
    var target = event.currentTarget;
    var option = $(target).data('switch');
    if(!option.onClass || !option.tab.hasClass(option.onClass)){
        this.to(option.tab);
    }
};

module.exports = SwitchTab;