var EventEmitter = require('EventEmitter');
var $ = require('jquery');
var Util = require('./util');

var _SwitchOption = function(){};

var SwitchTab = function(options){
    EventEmitter.call(this);

    this.data = [];
    this.curIndex = -1;
    this.disableNum = 0;
    options && this.init(options);
};

var proto = SwitchTab.prototype = new EventEmitter();

proto.defaultOptions = {
    tab: null,
    container: null,
    name: '',
    triggerEvent: 'click',
    triggerDelay: 0,
    beforSwitch: null,
    afterSwitch: null,
    onClass: 'on',
    enable: true
};

/** Extend the option merge by the defaultOptions and return a new option. */
proto.extendOption = function (option) {
    return $.extend(new _SwitchOption(), this.defaultOptions, option);
};
/**
 *  Get target option.
 *  The target can be <the tab index> | <the tab name> | <the tab Element> |  <the tab jQuery Object> | object contain above value
 *  @param target Number|String|DOMElement|JqueryObject|Object.tab
 *  @param ignoreEnable Boolean
 *  @return the target option in storage array
 */
proto.getOption = function (target, ignoreEnable) {
    var result = null;
    if(target instanceof _SwitchOption){
        result = target;
    }else if($.isNumeric(target)){
        var targetIndex = parseInt(target);
        var index = -1;
        $.each(this.data, function (i, item) {
            if((ignoreEnable || item.enable) && ++index == targetIndex){
                result = item;
                return false;
            }
        }.bind(this));
    } else if($.type(target) === 'string'){
        $.each(this.data, function (i, item) {
            if((ignoreEnable || item.enable) && item.name === target){
                result = item;
                return false;
            }
        }.bind(this));
    } else if(Util.isDOM(target) || Util.isJQuery(target)){
        target = target.get ? target.get(0) : target;
        $.each(this.data, function (i, item) {
            if((ignoreEnable || item.enable) && item.tab.get(0) === target){
                result = item;
                return false;
            }
        }.bind(this));
    } else if($.isPlainObject(target) && target.tab){
        return this.getOption(target.tab, ignoreEnable);
    }
    return result;
};

/**
 *  Get target index.
 *  The target can be <the tab index> | <the tab name> | <the tab Element> |  <the tab jQuery Object> | object contain above value
 *  @param target Number|String|DOMElement|JqueryObject|Object.tab
 *  @param ignoreEnable Boolean
 *  @return the target index which its enable prototype is true in storage array
 */
proto.getIndex = function (target, ignoreEnable) {
    var index = -1;
    var option = this.getOption(target, ignoreEnable);
    if(option){
        var targetIndex = -1;
        $.each(this.data, function (i, item) {
            if(ignoreEnable || item.enable){
                targetIndex++;
                if(item === option){
                    index = targetIndex;
                    return false;
                }
            }
        }.bind(this));
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

    this.to(0, true, true);
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
    if(!option.tab || !option.container) return;
    index = $.isNumeric(index) ? parseInt(index) : this.data.length;
    if(index < 0 || index > this.data.length){
        index = this.data.length;
    }
    var opt = this.getOption(option.tab, true);
    if(opt){
        opt.tab.off('.switchtab');
        this.data.splice(this.getIndex(opt, true), 1);
    }
    option.tab = $(option.tab);
    option.container = $(option.container);
    option = this.extendOption(option);
    if(!option.enable){
        option.tab.hide().removeClass('on');
        option.container.hide();
        this.disableNum++;
    }
    option._triggerHandler = function(event){
        if(option.triggerDelay){
            option._triggerDelayTimer = setTimeout(function(){
                this.onTriggerTab(event);
            }.bind(this), option.triggerDelay);
        }else{
            this.onTriggerTab(event);
        }
    }.bind(this);
    option.tab.on(option.triggerEvent + '.switchtab',option._triggerHandler).data('switch', option);
    if(option.triggerEvent == 'mouseover' && option.triggerDelay){
        option.tab.on('mouseout.switchtab', function(){
            clearTimeout(option._triggerDelayTimer);
        });
    }
    this.data.splice(index, 0, option);
};

/**
 *  Enable the target tab
 *  @param target @see getOption. If target is integer, it's based on the true position of the invisible tab.
 */
proto.enable = function(target){
    var option = this.getOption(target, true);
    var index = this.getIndex(option, true);
    if(!option || option.enable) return;

    option.enable = true;
    option.tab.show();
    this.disableNum--;
    if(this.disableNum == this.data.length - 1){
        this.to(0);
    }else{
        if(index <= this.curIndex){
            this.curIndex++;
        }
    }
};

/**
 *  Disable the target tab
 *  @param target @see getOption. If target is integer, it's base on the current visible tab position.
 */
proto.disable = function(target){
    var option = this.getOption(target);
    var index = this.getIndex(option);
    if(!option || !option.enable) return;

    option.enable = false;
    option.tab.hide().removeClass('on');
    option.container.hide();
    this.disableNum++;

    if(index < this.curIndex){
        this.curIndex--;
    }else if(index == this.curIndex){
        var toIndex = this.trigger('disableCurrent', [this.curIndex, index]);
        toIndex = $.isNumeric(toIndex) ? toIndex : this.curIndex - 1;//default choose the previous tab
        toIndex = Math.min(Math.max(0, toIndex), this.data.length - 1);
        if(this.disableNum == this.data.length){
            this.curIndex = -1;
        }else{
            this.to(toIndex, true, false);
        }
    }
};

/**
 *  Switch to target tab
 *  @param target @see getOption
 *  @param force Boolean. Force to show, although curIndex unchanged
 *  @param init Boolean.
 */
proto.to = function(target, force, init){
    var option = this.getOption(target);
    var index = this.getIndex(option);
    if(!option || index == -1 || (!force && this.curIndex === index)) return;

    if(!init){
        // before switch
        var flag = true;
        if($.isFunction(option.beforSwitch)){
            flag = option.beforSwitch.call(this, this.curIndex, index);
        } else {
            flag = this.trigger('beforSwitch', [this.curIndex, index]);
        }
        if(!flag) return;
    }
    // do switch
    var i, len, item;
    for(i = 0, len = this.data.length; i < len; i++){
        item = this.data[i];
        item.tab.removeClass('on');
        item.container.hide();
    }
    option.tab.addClass('on');
    option.container.show();
    if(!init) {
        // after switch
        if ($.isFunction(option.afterSwitch)) {
            option.afterSwitch.call(this, this.curIndex, index);
        } else {
            this.trigger('afterSwitch', [this.curIndex, index]);
        }
    }
    this.curIndex = index;
};

/**
 *  Switch to previous tab
 */
proto.prev = function(){
    this.to(this.curIndex - 1);
};

/**
 *  Switch to next tab
 */
proto.next = function(){
    this.to(this.curIndex + 1);
};

proto.onTriggerTab = function(event){
    var target = event.currentTarget;
    var option = $(target).data('switch');
    if(!option.onClass || !option.tab.hasClass(option.onClass)){
        this.to(option.tab, false, false);
    }
};

module.exports = SwitchTab;