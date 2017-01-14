var toBeSelectedCompare = function (negative) {
    return function (actual, expected) {
        var tab = $(actual),
            option = tab.data('switch');
        return {
            //pass: negative ? !tab.hasClass(option.onClass) : tab.hasClass(option.onClass)
            pass: negative ^ tab.hasClass(option.onClass)//异或运算
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
