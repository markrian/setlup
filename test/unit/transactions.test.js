import assert from 'assert';

import Transactions from '../../src/transactions';


describe('Transactions', () => {
  let transactions;

  beforeEach(() => {
    transactions = new Transactions();
  });

  it('has a list member', () => {
    assert.deepEqual(transactions.list, []);
  });

  it('can add transactions which show up in the list member', () => {
    let transaction = {
      creditor: 'foo',
      amount: 1234.56,
      debtors: ['foo', 'bar'],
    };
    transactions.add(transaction);
    assert.deepEqual(transactions.list, [transaction]);
  });

  it('resolves to empty list without any transactions', () => {
    let resolution = transactions.getResolution();
    assert.deepEqual(resolution, []);
  });

  it('resolves one transaction to its inverse', () => {
    let transaction = {
      creditor: 'foo',
      amount: 1234.56,
      debtors: ['foo', 'bar'],
    };
    transactions.add(transaction);

    assert.deepEqual(
      transactions.getResolution(),
      {
        creditor: 'bar',
        amount: 1234.56 / 2,
        debtors: 'foo',
      }
    );
  });

});
