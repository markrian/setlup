import chai from 'chai';
import assert from 'assert';

import Transactions from '../../app/transactions';


describe('Transactions', () => {
  let transactions;

  beforeEach(() => {
    transactions = new Transactions();
  });

  it('has a list member', () => {
    assert.deepEqual(transactions.list, []);
  });

  it('resolves to empty list without any transactions', () => {
    let resolution = transactions.getResolution();
    assert.deepEqual(resolution, []);
  });

});
