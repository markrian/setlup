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
