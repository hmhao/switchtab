(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["jQuery"], factory);
	else if(typeof exports === 'object')
		exports["SwitchTab"] = factory(require("jQuery"));
	else
		root["SwitchTab"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	if (!Function.prototype.bind) {
	    Function.prototype.bind = function (oThis) {
	        if (typeof this !== 'function') {
	            // closest thing possible to the ECMAScript 5
	            // internal IsCallable function
	            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	        }

	        var aArgs = Array.prototype.slice.call(arguments, 1),
	            fToBind = this,
	            fNOP = function () {
	            },
	            fBound = function () {
	                return fToBind.apply(this instanceof fNOP
	                        ? this
	                        : oThis,
	                    aArgs.concat(Array.prototype.slice.call(arguments)));
	            };

	        if (this.prototype) {
	            // Function.prototype doesn't have a prototype property
	            fNOP.prototype = this.prototype;
	        }
	        fBound.prototype = new fNOP();

	        return fBound;
	    };
	}

	if (!Array.prototype.filter) {
	    Array.prototype.filter = function (fun /*, thisArg */) {
	        "use strict";

	        if (this === void 0 || this === null)
	            throw new TypeError();

	        var t = Object(this);
	        var len = t.length >>> 0;
	        if (typeof fun !== "function")
	            throw new TypeError();

	        var res = [];
	        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	        for (var i = 0; i < len; i++) {
	            if (i in t) {
	                var val = t[i];

	                // NOTE: Technically this should Object.defineProperty at
	                //       the next index, as push can be affected by
	                //       properties on Object.prototype and Array.prototype.
	                //       But that method's new, and collisions should be
	                //       rare, so use the more-compatible alternative.
	                if (fun.call(thisArg, val, i, t))
	                    res.push(val);
	            }
	        }

	        return res;
	    };
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter = __webpack_require__(3);
	var $ = __webpack_require__(4);
	var Util = __webpack_require__(5);

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * EventEmitter v5.1.0 - git.io/ee
	 * Unlicense - http://unlicense.org/
	 * Oliver Caldwell - http://oli.me.uk/
	 * @preserve
	 */

	;(function (exports) {
	    'use strict';

	    /**
	     * Class for managing events.
	     * Can be extended to provide event functionality in other classes.
	     *
	     * @class EventEmitter Manages event registering and emitting.
	     */
	    function EventEmitter() {}

	    // Shortcuts to improve speed and size
	    var proto = EventEmitter.prototype;
	    var originalGlobalValue = exports.EventEmitter;

	    /**
	     * Finds the index of the listener for the event in its storage array.
	     *
	     * @param {Function[]} listeners Array of listeners to search through.
	     * @param {Function} listener Method to look for.
	     * @return {Number} Index of the specified listener, -1 if not found
	     * @api private
	     */
	    function indexOfListener(listeners, listener) {
	        var i = listeners.length;
	        while (i--) {
	            if (listeners[i].listener === listener) {
	                return i;
	            }
	        }

	        return -1;
	    }

	    /**
	     * Alias a method while keeping the context correct, to allow for overwriting of target method.
	     *
	     * @param {String} name The name of the target method.
	     * @return {Function} The aliased method
	     * @api private
	     */
	    function alias(name) {
	        return function aliasClosure() {
	            return this[name].apply(this, arguments);
	        };
	    }

	    /**
	     * Returns the listener array for the specified event.
	     * Will initialise the event object and listener arrays if required.
	     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	     * Each property in the object response is an array of listener functions.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Function[]|Object} All listener functions for the event.
	     */
	    proto.getListeners = function getListeners(evt) {
	        var events = this._getEvents();
	        var response;
	        var key;

	        // Return a concatenated array of all matching events if
	        // the selector is a regular expression.
	        if (evt instanceof RegExp) {
	            response = {};
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    response[key] = events[key];
	                }
	            }
	        }
	        else {
	            response = events[evt] || (events[evt] = []);
	        }

	        return response;
	    };

	    /**
	     * Takes a list of listener objects and flattens it into a list of listener functions.
	     *
	     * @param {Object[]} listeners Raw listener objects.
	     * @return {Function[]} Just the listener functions.
	     */
	    proto.flattenListeners = function flattenListeners(listeners) {
	        var flatListeners = [];
	        var i;

	        for (i = 0; i < listeners.length; i += 1) {
	            flatListeners.push(listeners[i].listener);
	        }

	        return flatListeners;
	    };

	    /**
	     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Object} All listener functions for an event in an object.
	     */
	    proto.getListenersAsObject = function getListenersAsObject(evt) {
	        var listeners = this.getListeners(evt);
	        var response;

	        if (listeners instanceof Array) {
	            response = {};
	            response[evt] = listeners;
	        }

	        return response || listeners;
	    };

	    function isValidListener (listener) {
	        if (typeof listener === 'function' || listener instanceof RegExp) {
	            return true
	        } else if (listener && typeof listener === 'object') {
	            return isValidListener(listener.listener)
	        } else {
	            return false
	        }
	    }

	    /**
	     * Adds a listener function to the specified event.
	     * The listener will not be added if it is a duplicate.
	     * If the listener returns true then it will be removed after it is called.
	     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListener = function addListener(evt, listener) {
	        if (!isValidListener(listener)) {
	            throw new TypeError('listener must be a function');
	        }

	        var listeners = this.getListenersAsObject(evt);
	        var listenerIsWrapped = typeof listener === 'object';
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
	                listeners[key].push(listenerIsWrapped ? listener : {
	                    listener: listener,
	                    once: false
	                });
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of addListener
	     */
	    proto.on = alias('addListener');

	    /**
	     * Semi-alias of addListener. It will add a listener that will be
	     * automatically removed after its first execution.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addOnceListener = function addOnceListener(evt, listener) {
	        return this.addListener(evt, {
	            listener: listener,
	            once: true
	        });
	    };

	    /**
	     * Alias of addOnceListener.
	     */
	    proto.once = alias('addOnceListener');

	    /**
	     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	     * You need to tell it what event names should be matched by a regex.
	     *
	     * @param {String} evt Name of the event to create.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvent = function defineEvent(evt) {
	        this.getListeners(evt);
	        return this;
	    };

	    /**
	     * Uses defineEvent to define multiple events.
	     *
	     * @param {String[]} evts An array of event names to define.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvents = function defineEvents(evts) {
	        for (var i = 0; i < evts.length; i += 1) {
	            this.defineEvent(evts[i]);
	        }
	        return this;
	    };

	    /**
	     * Removes a listener function from the specified event.
	     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to remove the listener from.
	     * @param {Function} listener Method to remove from the event.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListener = function removeListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var index;
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key)) {
	                index = indexOfListener(listeners[key], listener);

	                if (index !== -1) {
	                    listeners[key].splice(index, 1);
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of removeListener
	     */
	    proto.off = alias('removeListener');

	    /**
	     * Adds listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the first argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	     * You can also pass it a regular expression to add the array of listeners to all events that match it.
	     * Yeah, this function does quite a bit. That's probably a bad thing.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListeners = function addListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(false, evt, listeners);
	    };

	    /**
	     * Removes listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the first argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be removed.
	     * You can also pass it a regular expression to remove the listeners from all events that match it.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListeners = function removeListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(true, evt, listeners);
	    };

	    /**
	     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	     * The first argument will determine if the listeners are removed (true) or added (false).
	     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be added/removed.
	     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	     *
	     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
	        var i;
	        var value;
	        var single = remove ? this.removeListener : this.addListener;
	        var multiple = remove ? this.removeListeners : this.addListeners;

	        // If evt is an object then pass each of its properties to this method
	        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
	            for (i in evt) {
	                if (evt.hasOwnProperty(i) && (value = evt[i])) {
	                    // Pass the single listener straight through to the singular method
	                    if (typeof value === 'function') {
	                        single.call(this, i, value);
	                    }
	                    else {
	                        // Otherwise pass back to the multiple function
	                        multiple.call(this, i, value);
	                    }
	                }
	            }
	        }
	        else {
	            // So evt must be a string
	            // And listeners must be an array of listeners
	            // Loop over it and pass each one to the multiple method
	            i = listeners.length;
	            while (i--) {
	                single.call(this, evt, listeners[i]);
	            }
	        }

	        return this;
	    };

	    /**
	     * Removes all listeners from a specified event.
	     * If you do not specify an event then all listeners will be removed.
	     * That means every event will be emptied.
	     * You can also pass a regex to remove all events that match it.
	     *
	     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeEvent = function removeEvent(evt) {
	        var type = typeof evt;
	        var events = this._getEvents();
	        var key;

	        // Remove different things depending on the state of evt
	        if (type === 'string') {
	            // Remove all listeners for the specified event
	            delete events[evt];
	        }
	        else if (evt instanceof RegExp) {
	            // Remove all events matching the regex.
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    delete events[key];
	                }
	            }
	        }
	        else {
	            // Remove all listeners in all events
	            delete this._events;
	        }

	        return this;
	    };

	    /**
	     * Alias of removeEvent.
	     *
	     * Added to mirror the node API.
	     */
	    proto.removeAllListeners = alias('removeEvent');

	    /**
	     * Emits an event of your choice.
	     * When emitted, every listener attached to that event will be executed.
	     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	     * So they will not arrive within the array on the other side, they will be separate.
	     * You can also pass a regular expression to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {Array} [args] Optional array of arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emitEvent = function emitEvent(evt, args) {
	        var listenersMap = this.getListenersAsObject(evt);
	        var listeners;
	        var listener;
	        var i;
	        var key;
	        var response;

	        for (key in listenersMap) {
	            if (listenersMap.hasOwnProperty(key)) {
	                listeners = listenersMap[key].slice(0);

	                for (i = 0; i < listeners.length; i++) {
	                    // If the listener returns true then it shall be removed from the event
	                    // The function is executed either with a basic call or an apply if there is an args array
	                    listener = listeners[i];

	                    if (listener.once === true) {
	                        this.removeListener(evt, listener.listener);
	                    }

	                    response = listener.listener.apply(this, args || []);

	                    if (response === this._getOnceReturnValue()) {
	                        this.removeListener(evt, listener.listener);
	                    }
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of emitEvent
	     */
	    proto.trigger = alias('emitEvent');

	    /**
	     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {...*} Optional additional arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emit = function emit(evt) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return this.emitEvent(evt, args);
	    };

	    /**
	     * Sets the current value to check against when executing listeners. If a
	     * listeners return value matches the one set here then it will be removed
	     * after execution. This value defaults to true.
	     *
	     * @param {*} value The new value to check for when executing listeners.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.setOnceReturnValue = function setOnceReturnValue(value) {
	        this._onceReturnValue = value;
	        return this;
	    };

	    /**
	     * Fetches the current value to check against when executing listeners. If
	     * the listeners return value matches this one then it should be removed
	     * automatically. It will return true by default.
	     *
	     * @return {*|Boolean} The current value to check for or the default, true.
	     * @api private
	     */
	    proto._getOnceReturnValue = function _getOnceReturnValue() {
	        if (this.hasOwnProperty('_onceReturnValue')) {
	            return this._onceReturnValue;
	        }
	        else {
	            return true;
	        }
	    };

	    /**
	     * Fetches the events object and creates one if required.
	     *
	     * @return {Object} The events storage object.
	     * @api private
	     */
	    proto._getEvents = function _getEvents() {
	        return this._events || (this._events = {});
	    };

	    /**
	     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	     *
	     * @return {Function} Non conflicting EventEmitter class.
	     */
	    EventEmitter.noConflict = function noConflict() {
	        exports.EventEmitter = originalGlobalValue;
	        return EventEmitter;
	    };

	    // Expose the class either via AMD, CommonJS or the global object
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return EventEmitter;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	    else if (typeof module === 'object' && module.exports){
	        module.exports = EventEmitter;
	    }
	    else {
	        exports.EventEmitter = EventEmitter;
	    }
	}(this || {}));


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

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

/***/ }
/******/ ])
});
;