class Transactions {

  constructor() {
    this.list = [];
  }

  add(...transactions) {
    this.list.push(...transactions);
  }

  getPeople() {
    let people = [];
    this.list.forEach((transaction) => {
      people.push(transaction.creditor, ...transaction.debtors);
    })
    return new Set(people);
  }

  getResolution() {
    let balances = this._getBalances(this.list);
    let balancesList = [];
    for (let person in balances) {
      balancesList.push({ name: person, balance: balances[person].balance });
    }
    balancesList.sort((a, b) => {
      return b.balance - a.balance;
    });

    var resolvingTransactions = [];
  }

  _getBalances(transactions) {
    let balances = {};
    transactions.forEach((transaction) => {
      if (!balances[transaction.creditor]) {
        balances[transaction.creditor] = {
          balance: -transaction.amount,
        };
      } else {
        balances[transaction.creditor].balance += transaction.amount;
      }

      let numDebtors = transaction.debtors.length;
      transaction.debtors.forEach((debtor) => {
        let partialAmount = transaction.amount / numDebtors;
        if (!balances[debtor]) {
          balances[debtor] = {
            balance: partialAmount,
          }
        } else {
          balances[debtor].balance += partialAmount;
        }
      });
    });

    return balances;
  }

}


export { Transactions as default }
