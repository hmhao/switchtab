# SwitchTab

# Example
```
var st = new SwitchTab({
    tabs: $('.tabs a'),
    containers: $('.containers .container')
}, {
    triggerEvent: 'mouseover'
});
```

```
var st = new SwitchTab();
st.init({
    tabs: $('.tabs a'),
    containers: $('.containers .container'),
    names: $('.tabs a').map(function(){return $(this).attr('name')})
}, {
    triggerEvent: 'mouseover'
});
```

# Methods

##  `new SwitchTab(items, options)`
items
```
{
    tabs: Array < DOMElement | JqueryObject | JquerySelectors > ,
    containers: Array < DOMElement | JqueryObject | JquerySelectors > ,
    names: Array < String > ,
    enables: Array < Boolean > 
}
or
[
    {
        tab: DOMElement | JqueryObject | JquerySelectors ,
        container: DOMElement | JqueryObject | JquerySelectors ,
        name: String ,
        enable: Boolean
    },
    ...
]
```

options
```
{
    triggerEvent: String,
    triggerDelay: Number,
    activeClass: String
    startIndex: Number
}

```

## `st.init(items, options)`
Same as above options for SwitchTab constructor 

## `st.getItem(target [, ignoreEnable])`
Get target item.<br>
The target can be `SwitchItem` | `tab index` | `tab name` | `tab Element` | `tab jQuery Object`<br>
If `ignoreEnable` param true, return the option which ignore its enable prototype, otherwise return the option which its enable prototype is true.

## `st.getIndex(target [, ignoreEnable])`
Get target index.<br>
The target can be `SwitchItem` | `tab index` | `tab name` | `tab Element` | `tab jQuery Object`<br>
If `ignoreEnable` param true, return the index which ignore its enable prototype, otherwise return the index which its enable prototype is true.

## `st.add(item [, index])`
Add `item` include tab and container to the end of Swtichtab storage array.<br>
If `index` param, then intert into the index postion.

## `st.to(target [, force])`
Switch to target tab.<br>
The target can be `SwitchItem` | `tab index` | `tab name` | `tab Element` | `tab jQuery Object`

## `st.prev()`
Switch to previous tab

## `st.next()`
Switch to next tab

## `st.enable(target)`
Enable the target tab.<br>
If `target` is integer, it's based on the true position of the invisible tab.

## `st.disable(target)`
Disable the target tab.<br>
If `target` is integer, it's base on the current visible tab position.
