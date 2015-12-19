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
        let balancesList = [];
        for (let person in balances) {
            balancesList.push({ name: person, balance: balances[person] });
        }
        balancesList.sort((a, b) => {
            return b.balance - a.balance;
        });

        let resolvingTransactions = [];
        balancesList.forEach(item => {

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


export default Transactions;
