describe("SwitchTab", function () {
    describe("init", function () {
        var st;

        afterEach(function () {
            expect(st.data.length).toBe(4);
            expect(st.curIndex).toBe(0);
            $('.tabs a').each(function (i, tab) {
                tab = $(tab);
                var option = tab.data('switch');
                expect(option).toBe(st.data[i]);
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
                containers: $('.containers .container'),
                triggerEvent: 'mouseover'
            });
        });

        it("init method", function () {
            st = new SwitchTab();
            expect(st.data).toEqual([]);
            expect(st.curIndex).toBe(-1);
            st.init({
                tabs: $('.tabs a'),
                containers: $('.containers .container'),
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

    describe("add", function () {
        var option = {
            tab: $('.tabs a:eq(3)'),
            container: $('.containers .container:eq(3)'),
            triggerEvent: 'mouseover'
        };
        beforeEach(function () {
            st = new SwitchTab({
                tabs: $('.tabs a:lt(3)'),
                containers: $('.containers .container:lt(3)'),
                triggerEvent: 'mouseover'
            });
            expect(st.data.length).toBe(3);
        });
        afterEach(function () {
            expect(st.data.length).toBe(4);
        });

        it("without index", function () {
            st.add(option);
        });

        var index = -5 + Math.round(Math.random() * 15);
        it("with index " + index, function () {
            st.add(option, index);
            var len = st.data.length;
            expect(len).toBe(4);
            if (index < 0 || index >= len) {
                index = len - 1;
            }
            expect(st.data[index]).toEqual(option.tab.data('switch'));
        });
    });
    describe("to", function () {
        beforeEach(function () {
            st = new SwitchTab({
                tabs: $('.tabs a'),
                containers: $('.containers .container'),
                triggerEvent: 'mouseover'
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
            var option = st.data[tabIndex];
            st.to(option.tab[0]);
            expect(st.curIndex).toBe(tabIndex);
            expect(option.tab).toBeSelected();
        });
        it("pass tab[" + tabIndex + "] jquery object", function () {
            var option = st.data[tabIndex];
            st.to(option.tab);
            expect(st.curIndex).toBe(tabIndex);
            expect(option.tab).toBeSelected();
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
    });
});