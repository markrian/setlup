function Person(name) {
    this.name = name;
    this.owe = {};
}

Person.prototype.spent = function spent(desc, amount, people, ratios) {
    people.forEach(function setOweOwed(person, index, people) {
        person.owes(this, amount / people.length);
        this.owes(person, -amount / people.length);
    }, this);
};

Person.prototype.owes = function owes(person, amount) {
    if (this.owe[person] === undefined) {
        this.owe[person] = amount;
    } else {
        this.owe[person] += amount;
    }
};

Person.prototype.paid = function paid(person, amount) {
    this.owes(person, -amount);
    person.owes(this, amount);
};

Person.prototype.toPay = function toPay(person, amount) {
    this.paid(person, amount);
    console.log(this + " should pay " + person + " £" + amount.toFixed(2));
};

Person.prototype.totalToPay = function totalToPay(decimalPlaces) {
    var total = 0,
        name;

    for (name in this.owe) {
        total += this.owe[name];
    }

    return Math.abs(total) < 0.01 ? 0 : total;
};

Person.prototype.toString = function toString() {
    return this.name;
};
