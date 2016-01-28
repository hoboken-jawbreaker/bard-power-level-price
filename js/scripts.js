var races = {
    barbarian: 'barbarian',
    darkElf: 'darkelf',
    dwarf: 'dwarf',
    erudite: 'erudite',
    gnome: 'gnome',
    halfElf: 'halfelf',
    halfling: 'halfling',
    highElf: 'highelf',
    human: 'human',
    iksar: 'iksar',
    ogre: 'ogre',
    troll: 'troll',
    woodElf: 'woodelf'
};

var classes = {
    bard: 'bard',
    cleric: 'cleric',
    druid: 'druid',
    enchanter: 'enchanter',
    magician: 'magician',
    monk: 'monk',
    necromancer: 'necromancer',
    paladin: 'paladin',
    ranger: 'ranger',
    rogue: 'rogue',
    shadowknight: 'shadowknight',
    shaman: 'shaman',
    warrior: 'warrior',
    wizard: 'wizard'
};

var xt = new function() {
    this.string = new function() {
        // strip whitespace and make lowercase
        this.normalize = function(string) {
            return string.toLowerCase().replace(/\s/g, '');
        };
    };
    
    this.dictionary = new function() {
        this.values = function(dictionary) {
            var values = [];
            for (var key in dictionary) {
                values.push(dictionary[key]);
            }
            return values;
        };
    };
    
    this.list = new function() {
        this.contains = function(list, element) {
            for (var i in list) {
                if (list[i] == element) {
                    return true;
                }
            }
            return false;
        };
    };
};

function PriceModifier() {}

PriceModifier.prototype.modify = function(price) {
    return price / this.modifier();
};

function Race(name) {
    this.name = xt.string.normalize(name);
    if (!this.valid(this.name)) throw "invalid race";
}
Race.prototype = Object.create(PriceModifier.prototype);

Race.prototype.modifier = function() {
    if (this.name == races.iksar) return 0.8;
    if (this.name == races.troll) return 0.8;
    if (this.name == races.ogre) return 0.85;
    if (this.name == races.barbarian) return 0.95;
    if (this.name == races.halfling) return 1.05;
    return 1;
};

/** true if valid race name */
Race.prototype.valid = function(name) {
    return xt.list.contains(xt.dictionary.values(races), this.name);
};

function Class(name) {
    this.name = xt.string.normalize(name);
    if (!this.valid(this.name)) throw "invalid class";
}
Class.prototype = Object.create(PriceModifier.prototype);

Class.prototype.modifier = function() {
    return this.base() * this.difficulty();
};

/** base modifier (defined by game) */
Class.prototype.base = function() {
    if (this.name == classes.warrior) return 1.1;
    if (this.name == classes.rogue) return 1.09;
    return 1;
};

/** true if valid class name */
Class.prototype.valid = function(name) {
    return xt.list.contains(xt.dictionary.values(classes), this.name);
};

/** difficulty to power level (defined by power leveler) */
Class.prototype.difficulty = function() {
    // efficient pbae
    var easy = [classes.bard, classes.wizard, classes.magician];
    if (easy.indexOf(this.name) >= 0) return 1.4;
    
    // inefficient pbae
    var hard = [classes.cleric, classes.druid, classes.necromancer];
    if (hard.indexOf(this.name) >= 0) return 1.0;
    
    // no pbae
    return 0.7;
};

function ComboModifier(a, b) {
  this.a = a;
  this.b = b;
}

ComboModifier.prototype.modify = function(price) {
    return this.b.modify(this.a.modify(price));
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

function PriceCalculator(prices, modifier) {
    this.prices = prices;
    this.modifier = modifier;
}

PriceCalculator.prototype.calculate = function(begin, end) {
    if (begin >= end) return 0;
    
    var next = begin + 1;
    var price = this.modifier.modify(this.prices.price(next));
    return price + this.calculate(next, end);
};

////////////////////////////////////////////////////////////////////////////////

function test() {
    function formatPrice(price) {
        return 100 * Math.floor(price.toPrecision(3) / 100);
    }
    
    function rangeDiv(start, finish) {
        var range = '[' + start + '-' + finish + ']';
        var price = formatPrice(calculator.calculate(start, finish));
        return '<div>' + range + ' ' + price + '</div>';
    }
    
    var race = new Race('iksar');
    var cls = new Class('monk');
    var modifier = new ComboModifier(race, cls);
    var calculator = new PriceCalculator(new BasePrices, modifier);
    
    var output = '';
    output += rangeDiv(2, 10);
    output += rangeDiv(1, 50);
    output += rangeDiv(35, 40);
    document.getElementById('content').innerHTML = output;
}
test();