# SwitchTab

# Example
```
var st = new SwitchTab({
    tabs: $('.tabs a'),
    containers: $('.containers .container'),
    triggerEvent: 'mouseover'
});
```

```
var st = new SwitchTab();
st.init({
    tabs: $('.tabs a'),
    containers: $('.containers .container'),
    triggerEvent: 'mouseover'
});
```

# Methods

##  `new SwitchTab(options)`
options
```
{
    tabs: Array < DOMElement | JqueryObject | JquerySelectors > ,
    container: Array < DOMElement | JqueryObject | JquerySelectors > ,
    names: Array < String > ,
    triggerEvent: String,
    onClass: String
}
or
[
    {
        tab: DOMElement | JqueryObject | JquerySelectors,
        container: DOMElement | JqueryObject | JquerySelectors,
        triggerEvent: String,
        onClass: String
    },
    ...
]

```

## `st.init(options)`
Same as above options for SwitchTab constructor 

## `st.getOption(target [, ignoreEnable])`
Get target option.
The target can be `tab index` | `tab name` | `tab Element` | `tab jQuery Object` | `object contain above value`
If `ignoreEnable` param true, return the option which ignore its enable prototype, otherwise return the option which its enable prototype is true.

## `st.getIndex(target [, ignoreEnable])`
Get target index.
The target can be `tab index` | `tab name` | `tab Element` | `tab jQuery Object` | `object contain above value`
If `ignoreEnable` param true, return the index which ignore its enable prototype, otherwise return the index which its enable prototype is true.

## `st.add(option [, index])`
Add `option` include tab and container to the end of Swtichtab storage array.
If `index` param, then intert into the index postion.

## `st.to(target [, force, init])`
Switch to target tab.
The target can be `tab index` | `tab name` | `tab Element` | `tab jQuery Object`

## `st.enable(target)`
Enable the target tab.

## `st.disable(target)`
Disable the target tab.