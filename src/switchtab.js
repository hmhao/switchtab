var EventEmitter = require('EventEmitter');
var $ = require('jquery');
var Util = require('./util');

var SwitchItem = function(item, root){
    $.extend(this, SwitchItem.defaults, item);
    this.root = root;
};

SwitchItem.defaults = {
    tab: null,
    container: null,
    name: '',
    enable: true
};
var SwitchTab = function(items, options){
    this.settings = null;
    this.data = [];
    this.curIndex = -1;
    this.curItem = null;
    this.disableNum = 0;
    items && this.init(items, options);
};

Util.inherits(SwitchTab, EventEmitter);
var proto = SwitchTab.prototype;

SwitchTab.SwitchItem = SwitchItem;
SwitchTab.defaultSetting = {
    namespace: 'switch',
    eventSuffix: '.switch',
    triggerEvent: 'click',
    triggerDelay: 0,
    activeClass: 'on',
    startIndex: 0
};

/**
 *  Get target item.
 *  The target can be <SwitchItem> | <the tab index> | <the tab name> | <the tab Element> |  <the tab jQuery Object>
 *  @param target SwitchItem|Number|String|DOMElement|JqueryObject
 *  @param ignoreEnable Boolean
 *  @return the target item in storage array
 */
proto.getItem = function (target, ignoreEnable) {
    var result = null;
    if(target instanceof SwitchItem){
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
    }
    return result;
};

/**
 *  Get target index.
 *  The target can be <SwitchItem> | <the tab index> | <the tab name> | <the tab Element> |  <the tab jQuery Object>
 *  @param target SwitchItem|Number|String|DOMElement|JqueryObject
 *  @param ignoreEnable Boolean
 *  @return the target index which its enable prototype is true in storage array
 */
proto.getIndex = function (target, ignoreEnable) {
    var index = -1;
    var targetItem = this.getItem(target, ignoreEnable);
    if(targetItem){
        var targetIndex = -1;
        $.each(this.data, function (i, item) {
            if(ignoreEnable || item.enable){
                targetIndex++;
                if(item === targetItem){
                    index = targetIndex;
                    return false;
                }
            }
        });
    }
    return index;
};

/**
 *  Initialize the items with options
 *  @param items
 *  {
 *      tabs: Array<DOMElement|JqueryObject|JquerySelectors>,
 *      container: Array<DOMElement|JqueryObject|JquerySelectors>,
 *      names: Array<String>
 *      enables: Array<Boolean>
 *  }
 *  or
 *  [
 *   {
 *      tab: DOMElement|JqueryObject|JquerySelectors,
 *      container: DOMElement|JqueryObject|JquerySelectors,
 *      name: String,
 *      enable: Boolean
 *   },
 *   ...
 *  ]
*  @param options
 *  {
 *      triggerEvent: String,
 *      triggerDelay: Number,
 *      activeClass: String
 *      startIndex: Number
 *   }
 */
proto.init = function(items, options){
    //this.reset();
    if(!items) return;

    this.settings = $.extend({}, SwitchTab.defaultSetting, options);

    if($.isArray(items)) {
        $.each(items, function(i, item) {
            this.add(item);
        }.bind(this));
    } else if($.isPlainObject(items)){
        var tabs = items.tabs || [],
            containers = items.containers || [],
            names = items.names || [],
            enables = $.isArray(items.enables) ? items.enables : [];
        $.each(tabs, function(i, tab) {
            this.add({
                tab: tab,
                container: containers[i],
                name: names[i] || '',
                enable: $.type(enables[i]) === 'undefined' ? true : !!enables[i]
            });
        }.bind(this));
    } else {
        throw 'parse options error:' + options;
    }

    this.to(this.settings.startIndex);
};

/**
 *  Add tab and container item with index param to switchtab in its storage array.
 *  @param item {
 *      tab: DOMElement|JqueryObject|JquerySelectors,
 *      container: DOMElement|JqueryObject|JquerySelectors,
 *      name: String,
 *      enable: Boolean
 *  }
 *  @param index Number. The index must between 0 and the storage array length. If out of the range, push it to the end
 */
proto.add = function(item, index){
    if(!item.tab || !item.container) return;

    var settings = this.settings;
    if(!(item instanceof SwitchItem)){
        item = new SwitchItem(item, this);
    }

    index = $.isNumeric(index) ? parseInt(index) : this.data.length;
    if(index < 0 || index > this.data.length){
        index = this.data.length;
    }

    var oitem = this.getItem(item.tab);
    if(oitem){
        oitem.tab.off(settings.eventSuffix);
        this.data.splice(this.getIndex(oitem), 1);
        oitem.base = oitem.tab = oitem.container = null;
    }

    item.tab = $(item.tab);
    item.container = $(item.container);
    if(!item.enable){
        item.tab.hide().removeClass(settings.activeClass);
        item.container.hide();
        this.disableNum++;
    }
    item._triggerHandler = function(event){
        if(settings.triggerDelay){
            item._triggerDelayTimer = setTimeout(function(){
                this.onTriggerTab(event);
            }.bind(this), settings.triggerDelay);
        }else{
            this.onTriggerTab(event);
        }
    }.bind(this);
    item.tab
        .on(settings.triggerEvent + settings.eventSuffix, item._triggerHandler)
        .data(settings.namespace, item);
    if(settings.triggerEvent == 'mouseover' && settings.triggerDelay){
        item.tab.on('mouseout' + settings.eventSuffix, function(){
            clearTimeout(item._triggerDelayTimer);
        });
    }
    this.data.splice(index, 0, item);
};

/**
 *  Enable the target tab
 *  @param target @see getItem. If target is integer, it's based on the true position of the invisible tab.
 */
proto.enable = function(target){
    var item = this.getItem(target, true);
    var index = this.getIndex(item, true);
    if(!item || item.enable) return;

    item.enable = true;
    item.tab.show();
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
    var settings = this.settings;
    var item = this.getItem(target);
    var index = this.getIndex(item);
    if(!item || !item.enable) return;

    item.enable = false;
    item.tab.hide().removeClass(settings.activeClass);
    item.container.hide();
    this.disableNum++;

    if(index < this.curIndex){
        this.curIndex--;
    }else if(index == this.curIndex){
        var toIndex = this.trigger('disable.current'+settings.eventSuffix, [this.curIndex, index]);
        toIndex = $.isNumeric(toIndex) ? toIndex : this.curIndex - 1;//default choose the previous tab
        toIndex = Math.min(Math.max(0, toIndex), this.data.length - 1);
        if(this.disableNum == this.data.length){
            this.curIndex = -1;
        }else{
            this.to(toIndex, true);
        }
    }
};

/**
 *  Switch to target tab
 *  @param target @see getItem
 *  @param force Boolean. Force to show, although curIndex unchanged
 */
proto.to = function(target, force){
    var settings = this.settings;
    var item = this.getItem(target);
    var index = this.getIndex(item);
    if(!item || index == -1 || (!force && this.curIndex === index)) return;

    // before switch
    var flag = this.trigger('before'+settings.eventSuffix, [this.curIndex, index]);
    if(!flag) return;
    // do switch
    this.doSwitch(item);
    // after switch
    var lastIndex = this.curIndex;
    this.curIndex = index;
    this.curItem = item;
    this.trigger('after'+settings.eventSuffix, [lastIndex, this.curIndex]);
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

proto.doSwitch = function(item){
    var settings = this.settings;
    for(var i = 0, len = this.data.length; i < len; i++){
        this.data[i].tab.removeClass(settings.activeClass);
        this.data[i].container.hide();
    }
    item.tab.addClass(settings.activeClass);
    item.container.show();
};

proto.onTriggerTab = function(event){
    var target = event.currentTarget;
    var settings = this.settings;
    var item = $(target).data(settings.namespace);
    if(!settings.activeClass || !item.tab.hasClass(settings.activeClass)){
        this.to(item.tab, false, false);
    }
};

module.exports = SwitchTab;