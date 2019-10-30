var stock = {
    randomAroundZero: function() {
        return Math.random() > 0.5 ? 1 : -1;
    },

    getStockPrice: function(input) {
        let start = input.data[input.data.length - 1];
        let rate = input.rate;
        let variance = input.variance;

        if (start > 100) {
            start -= 1;
        } else if (start < 5) {
            start += 1;
        }

        return Math.round((start * rate + variance * stock.randomAroundZero()) * 100) / 100;
    },
};

module.exports = stock;
