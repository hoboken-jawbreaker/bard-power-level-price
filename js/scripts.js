function LevelPrices() {}

LevelPrices.prototype.price = function(start, finish) {
    if (start >= finish) return 0;
    
    var next = start + 1;
    return this.priceSingle(next) + this.price(next, finish);
};

LevelPrices.prototype.priceSingle = function(level) {
    var error = "level out of range";
    if (level < 2) throw error;
    
    if (level <= 10) return 200;
    if (level <= 15) return 400;
    if (level <= 20) return 500;
    if (level <= 30) return 1000;
    if (level == 31) return 2500;
    if (level <= 35) return 1500;
    if (level == 36) return 2500;
    if (level <= 40) return 2000;
    if (level == 41) return 3000;
    if (level <= 45) return 2000;
    if (level == 46) return 4000;
    if (level <= 48) return 2500;
    if (level <= 50) return 3000;
    
    throw error;
};

var prices = new LevelPrices;

function rangeDiv(start, finish) {
    var range = '[' + start + '-' + finish + ']';
    var price = prices.price(start, finish);
    return '<div>' + range + ' ' + price + '</div>';
}
var output = '';
output += rangeDiv(2, 10);
output += rangeDiv(1, 50);
output += rangeDiv(35, 40);
document.getElementById('content').innerHTML = output;