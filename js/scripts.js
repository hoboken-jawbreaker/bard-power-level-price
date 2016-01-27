function PriceModifier() {}

PriceModifier.prototype.modify = function(price) {
    return price / this.modifier();
};

function Race(name) {
    this.name = name;
}
Race.prototype = Object.create(PriceModifier.prototype)

Race.prototype.modifier = function() {
    if (this.name == 'iksar') return 0.8;
    if (this.name == 'troll') return 0.8;
    if (this.name == 'ogre') return 0.85;
    if (this.name == 'barbarian') return 0.95;
    if (this.name == 'halfling') return 1.05;
    return 1;
};

function Class(name) {
    this.name = name;
}
Class.prototype = Object.create(PriceModifier.prototype)

Class.prototype.modifier = function() {
    if (this.name == 'rogue') return 1.09;
    if (this.name == 'warrior') return 1.1;
    return 1;
};

function BasePrices() {}

BasePrices.prototype.price = function(level) {
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

function PriceCalculator(prices, race, cls) {
    this.prices = prices;
    this.race = race;
    this.cls = cls;
}

PriceCalculator.prototype.calculate = function(begin, end) {
    if (begin >= end) return 0;
    
    var next = begin + 1;
    var price = this.race.modify(this.cls.modify(this.prices.price(next)));
    return price + this.calculate(next, end);
};

var calculator = new PriceCalculator(new BasePrices, new Race('iksar'), new Class('monk'));

function rangeDiv(start, finish) {
    var range = '[' + start + '-' + finish + ']';
    var price = calculator.calculate(start, finish);
    return '<div>' + range + ' ' + price + '</div>';
}
var output = '';
output += rangeDiv(2, 10);
output += rangeDiv(1, 50);
output += rangeDiv(35, 40);
document.getElementById('content').innerHTML = output;