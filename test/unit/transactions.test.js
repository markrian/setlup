import assert from 'assert';

import Transactions from '../../src/transactions';


describe('Transactions', function () {
  let transactions;

  beforeEach(function () {
    transactions = new Transactions();
  });

  it('has a list member', function () {
    assert.deepEqual(transactions.list, []);
  });

  it('can add transactions which show up in the list member', function () {
    let transaction = {
      creditor: 'foo',
      amount: 1234.56,
      debtors: ['foo', 'bar'],
    };
    transactions.add(transaction);
    assert.deepEqual(transactions.list, [transaction]);

    let transactions_ = [{
      creditor: 'foo',
      amount: 1234.56,
      debtors: ['biz', 'bar'],
    }, {
      creditor: 'baz',
      amount: 1,
      debtors: ['bar', 'foo']
    }];
    transactions.add(...transactions_);
    assert.deepEqual(transactions.list, [transaction, ...transactions_]);
  });

  it('can list the people involved in all transactions', function () {
    let transactions_ = [{
      creditor: 'foo',
      amount: 1234.56,
      debtors: ['foo', 'bar'],
    }, {
      creditor: 'baz',
      amount: 1,
      debtors: ['bar', 'foo']
    }];
    transactions.add(...transactions_);
    assert.deepEqual(['foo', 'bar', 'baz'], [...transactions.getPeople()]);
  });

  it('resolves to empty list without any transactions', function () {
    let resolution = transactions.getResolution();
    assert.deepEqual(resolution, []);
  });

  it('resolves one transaction to its inverse', function () {
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
