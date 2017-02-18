var toBeSelectedCompare = function (negative) {
    return function (actual, expected) {
        var tab = $(actual),
            data = tab.data('switch'),
            activeClass = data.root.settings.activeClass;
        return {
            //pass: negative ? !tab.hasClass(activeClass) : tab.hasClass(activeClass)
            pass: negative ^ tab.hasClass(activeClass)//异或运算
        };
    }
};

beforeEach(function () {
    jasmine.addMatchers({
        toBeSelected: function (util, customEqualityTesters) {
            return {
                compare: toBeSelectedCompare(false),
                negativeCompare: toBeSelectedCompare(true)
            };
        }
    });
});
