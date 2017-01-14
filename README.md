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

## `st.add(option [, index])`
Add `option` include tab and container to the end of Swtichtab storage array.
If `index` param, then intert into the index postion .

## `st.to(target)`
Switch to target tab
The target can be `tab index` | `tab name` | `tab Element` | `tab jQuery Object`