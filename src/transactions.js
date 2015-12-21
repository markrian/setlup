import _ from 'lodash';

import RationalNumber from './rational-number';


class Transactions {

    constructor() {
        this.list = [];
    }

    add(...transactions) {
        let _transactions = _.cloneDeep(transactions);
        _transactions.forEach(transaction => {
            if (!(transaction.amount instanceof RationalNumber)) {
                transaction.amount = RationalNumber.fromNumber(transaction.amount);
            }
        });
        this.list.push(..._transactions);
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
            return Math.abs(b.balance) - Math.abs(a.balance);
        }

        function absoluteBalanceDesc(a, b) {
            return absoluteBalanceAsc(b, a);
        }

        let resolvingTransactions = [];
        debtors.forEach(debtor => {
            while (debtor.balance > 0) {
                let creditor = _.find(creditors, c => c.balance < 0);
                assert(creditor, 'no next creditor found; balances do not sum to zero, probably!');
                let toPay = 0;
                if (Math.abs(creditor.balance) > debtor.balance) {
                    toPay = debtor.balance;
                } else {
                    toPay = Math.abs(creditor.balance);
                }
                debtor.balance -= toPay;
                resolvingTransactions.push({
                    creditor: debtor.name,
                    amount: toPay,
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
                balances[transaction.creditor] = -transaction.amount;
            } else {
                balances[transaction.creditor] -= transaction.amount;
            }

            let numDebtors = transaction.debtors.length;
            transaction.debtors.forEach(debtor => {
                let partialAmount = transaction.amount / numDebtors;
                if (!balances[debtor]) {
                    balances[debtor] = partialAmount;
                } else {
                    balances[debtor] += partialAmount;
                }
            });
        });

        return balances;
    }

}


function assert(truthy, message) {
    if (!truthy) throw new Error(message);
}


export default Transactions;
