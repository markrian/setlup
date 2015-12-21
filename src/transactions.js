import _ from 'lodash';


class Transactions {

    constructor() {
        this.list = [];
    }

    add(...transactions) {
        this.list.push(..._.cloneDeep(transactions));
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

        debtors.forEach(debtor => {
            while (debtor.balance > 0) {
                break;
            }
       });


        let resolvingTransactions = [];
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


export default Transactions;
