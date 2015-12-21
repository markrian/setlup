import _ from 'lodash';

import RationalNumber from './rational-number';


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
            transaction = _.cloneDeep(transaction);
            transaction.amount = primitiveAmount;
            return transaction;
        });
    }

    getPeople() {
        let people = [];
        this.list.forEach(transaction => {
            people.push(transaction.creditor, ...transaction.debtors);
        })
        return _.unique(people);
    }

    getResolution() {
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
                let creditor = _.find(creditors, c => c.balance < 0);
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
                    amount: toPay.valueOf(),
                    debtors: [creditor.name],
                });
            }
       });

       return resolvingTransactions;
    }

    getBalances() {
        let balances = {};
        this.list.forEach(transaction => {
            if (!balances[transaction.creditor]) {
                balances[transaction.creditor] = RationalNumber.fromNumber(0);
            }
            balances[transaction.creditor] = balances[transaction.creditor]
                .subtract(transaction.amount);

            let numDebtors = transaction.debtors.length;
            transaction.debtors.forEach(debtor => {
                let partialAmount = transaction.amount.divide(
                    RationalNumber.fromNumber(numDebtors));
                if (!balances[debtor]) {
                    balances[debtor] = RationalNumber.fromNumber(0);
                }
                balances[debtor] = balances[debtor].add(partialAmount);
            });
        });

        return balances;
    }

}


function normalisedTransaction(transaction) {
    if (transaction.amount instanceof RationalNumber) {
        return transaction;
    }

    let amount = RationalNumber.fromNumber(transaction.amount);
    transaction = _.cloneDeep(transaction);
    transaction.amount = amount;
    return transaction;
}


function assert(truthy, message) {
    if (!truthy) throw new Error(message);
}


export default Transactions;
