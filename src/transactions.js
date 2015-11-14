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
    return [];
  }

}

export { Transactions as default }
