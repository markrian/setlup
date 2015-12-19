
function People(people) {
    this.people = people || [];
}

People.sorts = {
    absDescending: function (person1, person2) {
        return Math.abs(person2.totalToPay()) - Math.abs(person1.totalToPay());
    }
};

People.filters = {
    debtors: function (person) {
        if (person.totalToPay() > 0) {
            return true;
        } else {
            return false;
        }
    },

    creditors: function (person) {
        if (person.totalToPay() < 0) {
            return true;
        } else {
            return false;
        }
    }
};

People.prototype.add = function (person) {
    this.people.push(person);
};

People.prototype.sort = function (method, reverse) {
    this.people.sort(People.sorts[method]);
    if (reverse) {
        this.people.reverse();
    }
};

["debtors", "creditors"].forEach(function (method) {
    People.prototype[method] = function () {
        var list = this.people.filter(People.filters[method]);
        return list.sort(People.sorts.absDescending);
    };
});

People.prototype.settleUpPerson = function (person) {
    /*jshint boss: true */
    var debt, credit, creditor, creditors;

    while ((debt = person.totalToPay()) > 0) {
        creditors = this.creditors();
        creditor = creditors[0];
        credit = -creditor.totalToPay();
        if (debt > credit) {
            person.toPay(creditor, credit);
        } else {
            person.toPay(creditor, debt);
        }
    }
};

People.prototype.settleUp = function () {
    this.debtors().forEach(this.settleUpPerson, this);
};

People.prototype.toString = function () {
    return this.people.join(", ");
};

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

function printWhoOwesWhat() {
    everyone.forEach(function (person) {
        var toPay = parseFloat(person.totalToPay().toFixed(2)),
            verb;

        if (toPay > 0) {
            verb = " owes ";
            toPay = "£" + toPay;
        } else if (toPay < 0) {
            verb = " is owed ";
            toPay = "£" + (-toPay);
        } else {
            verb = " owes nothing!";
            toPay = "";
        }

        console.log(person + verb + toPay);
    });
}

function heading(text) {
    console.log("\n=== " + text + " ===\n");
}

var gary = new Person("Gary"),
    joe = new Person("Joe"),
    juliet = new Person("Juliet"),
    shaun = new Person("Shaun"),
    david = new Person("David"),
    mark = new Person("Mark"),
    nick = new Person("Nick"),
    everyone = [gary, joe, juliet, shaun, david, mark, nick];

var people = new People(everyone);

gary.spent("Food", 1100, [gary, joe, juliet, shaun, david, mark]);
mark.spent("Girls", 1100, [gary, joe, juliet, shaun, david, mark]);
juliet.spent("Bliscuit", 1100, [gary, joe, juliet, shaun, david, mark]);
shaun.spent("Drugs", 1100, [gary, joe, juliet, shaun, david, mark]);
nick.spent("Booze", 600, [gary, joe, juliet, shaun, david, mark]);
david.spent("Games", 1100, [gary, joe, juliet, shaun, david, mark]);
joe.spent("Cars", 1100, [gary, joe, juliet, shaun, david, mark]);

mark.paid(nick, 100);

people.settleUp();
