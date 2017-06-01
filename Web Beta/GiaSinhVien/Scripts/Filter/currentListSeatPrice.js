giasinhvienApp.filter("currentListSeatPrice",
    function () {
        return function (input, currentPrice) {
            if (!currentPrice || input.constructor !== Array || isNaN(currentPrice))
                return input;

            var r = [];
            $(input).each(function(i, x) {
                if (x <= currentPrice)
                    return;
                r.push(x);
            });
            return r;
        };
    }
);