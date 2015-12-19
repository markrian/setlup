import { assert } from 'chai';
import _ from 'lodash';

import chance from '../support/chance';

import Transactions from '../../src/transactions';


describe('Transactions', function () {
  let transactions;

  beforeEach(function () {
    transactions = new Transactions();
  });

  it('has a list member', function () {
    assert(Array.isArray(transactions.list));
    assert.strictEqual(transactions.list.length, 0);
  });

  it('can add transactions which show up in the list member', function () {
    let transaction = makeTransaction();
    transactions.add(transaction);

    assert.deepEqual(transactions.list, [transaction]);

    let moreTransactions = repeat(makeTransaction, 2);
    transactions.add(...moreTransactions);

    assert.deepEqual(transactions.list, [transaction, ...moreTransactions]);
  });

  it('makes copies of added transactions', function () {
      let transaction = makeTransaction();
      transactions.add(transaction);

      let transactionInList = transactions.list[0];
      assert.deepEqual(transactionInList, transaction);
      assert.notStrictEqual(transactionInList, transaction);
  });

  it('can list the people involved in all transactions', function () {
    let someTransactions = repeat(makeTransaction, 2);
    transactions.add(...someTransactions);
    let actual = _.unique(transactions.getPeople().sort());
    let expected = _.unique([
        someTransactions[0].creditor,
        someTransactions[1].creditor,
        ...someTransactions[0].debtors,
        ...someTransactions[1].debtors,
    ].sort())

    assert.deepEqual(actual, expected);
  });

  it('resolves to empty list without any transactions', function () {
    let resolution = transactions.getResolution();
    assert.deepEqual(resolution, []);
  });

  it.skip('resolves one transaction to its inverse', function () {
    let transaction = makeTransaction();
    transactions.add(transaction);

    assert.deepEqual(transactions.getResolution(), transaction);
  });

});

function makeTransaction() {
    let debtors = new Set(repeat(
        chance.first.bind(chance),
        chance.integer({ min: 1, max: 10})
    ));
    return {
        creditor: chance.first(),
        amount: chance.floating({ min: 0.1, max: 1000 }),
        debtors: debtors,
    };
}

function repeat(fn, n) {
    let result = [];
    while (n--) {
        result.push(fn());
    }
    return result;
}
