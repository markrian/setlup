import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import includes from 'lodash/includes';
import uniq from 'lodash/uniq';
import bigRat from 'big-rational';


class Transactions {

    constructor() {
        this.list = [];
    }

    add(...transactions) {
        let normalisedTransactions = transactions.map(normalisedTransaction);
        this.list.push(...normalisedTransactions);
    }

    getPrimitiveList() {
        return this.list.map(transaction => {
            var primitiveAmount = transaction.amount.valueOf();
            transaction = cloneDeep(transaction);
            transaction.amount = primitiveAmount;
            return transaction;
        });
    }

    getPeople() {
        let people = [];
        this.list.forEach(transaction => {
            let debtors = transaction.debtors;
            if (includes(debtors, '*')) debtors = [];
            people.push(transaction.creditor, ...debtors);
        })
        return uniq(people);
    }

    getResolution(options = {}) {
        let balances = this.getBalances();
        let debtors = [];
        let creditors = [];
        for (let person in balances) {
            if (balances[person] > 0) {
                debtors.push({ name: person, balance: balances[person] });
            } else if (balances[person] < 0) {
                creditors.push({ name: person, balance: balances[person] });
            }
        }
        creditors.sort(absoluteBalanceAsc);
        debtors.sort(absoluteBalanceAsc);

        function absoluteBalanceAsc(a, b) {
            a = a.balance.abs().valueOf();
            b = b.balance.abs().valueOf();
            return b - a;
        }

        let resolvingTransactions = [];
        debtors.forEach(debtor => {
            while (debtor.balance > 0) {
                let creditor = find(creditors, c => c.balance < 0);
                assert(creditor, 'no next creditor found, probably due to rounding error!');
                let toPay;
                if (Math.abs(creditor.balance) > debtor.balance) {
                    toPay = debtor.balance;
                } else {
                    toPay = creditor.balance.abs();
                }
                creditor.balance = creditor.balance.add(toPay);
                debtor.balance = debtor.balance.subtract(toPay);
                resolvingTransactions.push({
                    creditor: debtor.name,
                    amount: options.primitive ? toPay.valueOf() : toPay,
                    debtors: [creditor.name],
                });
            }
       });

       return resolvingTransactions;
    }

    getBalances(options = {}) {
        let balances = {};
        const people = this.getPeople();
        this.list.forEach(transaction => {
            if (!balances[transaction.creditor]) {
                balances[transaction.creditor] = bigRat();
            }
            balances[transaction.creditor] = balances[transaction.creditor]
                .subtract(transaction.amount);

            let debtors;
            if (includes(transaction.debtors, '*')) {
                debtors = people;
            } else {
                debtors = transaction.debtors;
            }
            debtors.forEach(debtor => {
                let partialAmount = transaction.amount.divide(debtors.length);
                if (!balances[debtor]) {
                    balances[debtor] = bigRat();
                }
                balances[debtor] = balances[debtor].add(partialAmount);
            });
        });

        if (options.primitive) {
            Object.keys(balances).forEach(key => {
                balances[key] = balances[key].valueOf();
            });
        }

        return balances;
    }

}


function normalisedTransaction(transaction) {
    let amount = bigRat(transaction.amount);
    transaction = cloneDeep(transaction);
    transaction.amount = amount;
    return transaction;
}


function assert(truthy, message) {
    if (!truthy) throw new Error(message);
}


export default Transactions;
