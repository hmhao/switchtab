var st, items, item;

describe("SwitchTab", function () {
    testInit();
    testAdd();
    testTo();
    testPrevNext();
    testHandler();
    testDisable();
    testEnable();
});

function testInit(){
    describe("init", function () {
        afterEach(function () {
            expect(st.data.length).toBe(4);
            expect(st.curIndex).toBe(0);
            $('.tabs a').each(function (i, tab) {
                tab = $(tab);
                item = tab.data('switch');
                expect(item).toBe(st.data[i]);
                if (i == 0) {
                    expect(tab).toBeSelected();
                } else {
                    expect(tab).not.toBeSelected();
                }
            });
        });

        it("constructor", function () {
            st = new SwitchTab({
                tabs: $('.tabs a'),
                containers: $('.containers .container')
            }, {
                triggerEvent: 'mouseover'
            });
        });

        it("init method", function () {
            st = new SwitchTab();
            expect(st.data).toEqual([]);
            expect(st.curIndex).toBe(-1);
            st.init({
                tabs: $('.tabs a'),
                containers: $('.containers .container')
            }, {
                triggerEvent: 'mouseover'
            });
        });

        it("init method pass array", function () {
            st = new SwitchTab();
            st.init([{
                tab: $('.tabs a:eq(0)'),
                container: $('.containers .container:eq(0)')
            }, {
                tab: $('.tabs a:eq(1)'),
                container: $('.containers .container:eq(1)')
            }, {
                tab: $('.tabs a:eq(2)'),
                container: $('.containers .container:eq(2)')
            }, {
                tab: $('.tabs a:eq(3)'),
                container: $('.containers .container:eq(3)')
            }]);
        });
    });
}

function testAdd(){
    describe("add", function () {
        beforeEach(function () {
            st = new SwitchTab({
                tabs: $('.tabs a:lt(3)'),
                containers: $('.containers .container:lt(3)')
            }, {
                triggerEvent: 'mouseover'
            });
            expect(st.data.length).toBe(3);
            item = {
                tab: $('.tabs a:eq(3)'),
                container: $('.containers .container:eq(3)')
            };
        });

        it("without index", function () {
            st.add(item);
            expect(st.data.length).toBe(4);
        });

        var index = -5 + Math.round(Math.random() * 15);
        it("with index " + index, function () {
            st.add(item, index);
            var len = st.data.length;
            expect(len).toBe(4);
            if (index < 0 || index >= len) {
                index = len - 1;
            }
            expect(st.data[index]).toEqual(item.tab.data('switch'));
            expect(st.data.length).toBe(4);
        });

        it("tab exist", function () {
            var len = st.data.length;
            item = {
                tab: $('.tabs a:eq(1)'),
                container: $('.containers .container:eq(1)')
            };
            st.add(item);
            expect(st.data.length).toBe(len);
            expect(st.data[2].tab.get(0)).toBe(item.tab.get(0));
            var newIndex = Math.floor(Math.random() * len);
            st.add(item, newIndex);
            expect(st.data.length).toBe(len);
            expect(st.data[newIndex].tab.get(0)).toBe(item.tab.get(0));
        });
    });
}

function testTo(){
    describe("to", function () {
        beforeEach(function () {
            st = new SwitchTab({
                tabs: $('.tabs a'),
                containers: $('.containers .container')
            }, {
                triggerEvent: 'mouseover'
            });
        });
        afterEach(function () {
            $.each(st.data, function (i, item) {
                item.tab.off();
            });
        });

        var index = -3 + Math.round(Math.random() * 10);
        it("pass " + index, function () {
            st.to(index);
            if (index < 0 || index >= st.data.length) {
                expect(st.curIndex).toBe(0);
                expect(st.data[0].tab).toBeSelected();
            } else {
                expect(st.curIndex).toBe(index);
                expect(st.data[index].tab).toBeSelected();
            }
        });

        var tabIndex = Math.floor(Math.random() * 4);
        it("pass tab[" + tabIndex + "] element", function () {
            item = st.data[tabIndex];
            st.to(item.tab[0]);
            expect(st.curIndex).toBe(tabIndex);
            expect(item.tab).toBeSelected();
        });
        it("pass tab[" + tabIndex + "] jquery object", function () {
            item = st.data[tabIndex];
            st.to(item.tab);
            expect(st.curIndex).toBe(tabIndex);
            expect(item.tab).toBeSelected();
        });

        it("pass 3 then pass 1", function () {
            var i = 3;
            st.to(i);
            expect(st.curIndex).toBe(i);
            expect(st.data[i].tab).toBeSelected();
            i = 1;
            st.to(i);
            expect(st.curIndex).toBe(i);
            expect(st.data[i].tab).toBeSelected();
        });

        var triggerIndex = Math.floor(Math.random() * 4);
        it("trigger by tab[" + triggerIndex + "] event", function () {
            item = st.data[triggerIndex];
            item.tab.trigger(st.settings.triggerEvent);
            expect(st.curIndex).toBe(triggerIndex);
            expect(st.data[triggerIndex].tab).toBeSelected();
        });
    });
}

function testPrevNext(){
    describe("PrevNext", function () {
        beforeEach(function () {
            st = new SwitchTab({
                tabs: $('.tabs a'),
                containers: $('.containers .container')
            }, {
                triggerEvent: 'mouseover'
            });
        });
        afterEach(function () {
            $.each(st.data, function (i, item) {
                item.tab.off();
            });
        });

        var testItem = function(isPrev){
            return function(){
                var lastIndex = st.curIndex;
                if(isPrev){
                    st.prev();
                    if(lastIndex === 0){
                        expect(st.curIndex).toBe(lastIndex);
                        expect(st.data[lastIndex].tab).toBeSelected();
                    }else{
                        expect(st.curIndex).toBe(lastIndex - 1);
                        expect(st.data[lastIndex - 1].tab).toBeSelected();
                    }
                }else{
                    st.next();
                    if(lastIndex === st.data.length - 1){
                        expect(st.curIndex).toBe(lastIndex);
                        expect(st.data[lastIndex].tab).toBeSelected();
                    }else{
                        expect(st.curIndex).toBe(lastIndex + 1);
                        expect(st.data[lastIndex + 1].tab).toBeSelected();
                    }
                }
            };
        };

        var specs = (function(){
            var result = [];
            for(var i = 0; i < 10; i++){
                result.push(Math.round(Math.random()));
            }
            return result;
        })();
        for(var i = 0, len = specs.length, spec; i < len; i++){
            spec = specs[i];
            it((spec ? "prev " : "next "), testItem(spec));
        }
    });
}

function testHandler(){
    describe("handler", function () {
        beforeEach(function () {
            st = new SwitchTab();
            items = {
                tabs: $('.tabs a'),
                containers: $('.containers .container')
            };
        });
        afterEach(function () {
            $.each(st.data, function (i, item) {
                item.tab.off();
            });
        });
        it("event before.switch", function () {
            var curIndex, nextIndex;
            st.init(items);
            st.on('before.switch', function (cur, next) {
                expect(cur).toBe(curIndex);
                expect(next).toBe(nextIndex);
                expect(st.data[cur].tab).toBeSelected();
                expect(st.data[next].tab).not.toBeSelected();
            });
            curIndex = st.curIndex;
            nextIndex = 3;
            st.to(nextIndex);
        });
        it("event after.switch", function () {
            var prevIndex, curIndex;
            st.init(items);
            st.on('after.switch', function (prev, cur) {
                expect(prev).toBe(prevIndex);
                expect(cur).toBe(curIndex);
                expect(st.data[prev].tab).not.toBeSelected();
                expect(st.data[cur].tab).toBeSelected();
            });
            prevIndex = st.curIndex;
            curIndex = 3;
            st.to(curIndex);
        });
    });
}

function testDisable(){
    describe("disable", function () {
        beforeEach(function () {
            st = new SwitchTab({
                tabs: $('.tabs a').show(),
                containers: $('.containers .container'),
                names: $('.tabs a').map(function(){return $(this).attr('name')})
            }, {
                triggerEvent: 'mouseover'
            });
        });
        afterEach(function () {
            $.each(st.data, function (i, item) {
                item.tab.off();
            });
        });
        var disableTest = function (spec) {
            return function(){
                st.to(spec.to);
                st.disable(spec.disable);
                //console.log(st.curIndex);
                if(spec.disable < spec.to){
                    expect(st.curIndex).toBe(spec.to-1);
                    expect(st.data[spec.to].tab).toBeSelected();
                }else if(spec.disable > spec.to){
                    expect(st.curIndex).toBe(spec.to);
                    expect(st.data[spec.to].tab).toBeSelected();
                }else {
                    if(spec.disable == 0){
                        expect(st.curIndex).toBe(spec.disable);
                        expect(st.data[spec.disable+1].tab).toBeSelected();
                    }else{
                        expect(st.curIndex).toBe(spec.disable-1);
                        expect(st.data[spec.disable-1].tab).toBeSelected();
                    }
                }
            };
        };
        /*var specs = (function(){
            var result = [];
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 4; j++){
                    result.push({
                        to: i,
                        disable: j
                    });
                }
            }
            return result;
        })();
        for(var i = 0, len = specs.length, spec; i < len; i++){
            spec = specs[i];
            it("to " + spec.to + ", disable " + spec.disable, disableTest(spec));
        }*/
        var spec = {to: Math.floor(Math.random() * 4), disable: Math.floor(Math.random() * 4)};
        it("to " + spec.to + ", disable " + spec.disable, disableTest(spec));
    });
}

function testEnable(){
    describe("enable", function () {
        var disable = Math.floor(Math.random() * 4);
        beforeEach(function () {
            st = new SwitchTab({
                tabs: $('.tabs a').show(),
                containers: $('.containers .container'),
                names: $('.tabs a').map(function(){return $(this).attr('name')})
            }, {
                triggerEvent: 'mouseover'
            });
            st.disable(disable);
        });
        var enableTest = function (spec) {
            return function(){
                st.to(spec.to);
                var isVail = st.getItem(spec.enable, true).enable === false;
                st.enable(spec.enable);
                if(isVail){
                    if(spec.enable <= spec.to){
                        expect(st.curIndex).toBe(spec.to+1);
                        expect(st.data[spec.to+1].tab).toBeSelected();
                    }else{
                        expect(st.curIndex).toBe(spec.to);
                    }
                }else{
                    expect(st.curIndex).toBe(spec.to);
                }
            };
        };
        /*var specs = (function(){
            var result = [];
            for(var i = 0; i < 3; i++){
                for(var j = 0; j < 4; j++){
                    result.push({
                        to: i,
                        enable: j
                    });
                }
            }
            return result;
        })();
        for(var i = 0, len = specs.length, spec; i < len; i++){
            spec = specs[i];
            it("disable " + disable + ", to " + spec.to + ", enable " + spec.enable, enableTest(spec));
        }*/
        var spec = {to: Math.floor(Math.random() * 3), enable: Math.floor(Math.random() * 4)};
        it("disable " + disable + ", to " + spec.to + ", enable " + spec.enable, enableTest(spec));
    });
}