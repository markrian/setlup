import chai from 'chai';
import assert from 'assert';

import Transactions from '../../app/transactions';


describe('Transactions', () => {

  it('exists', () => {
    assert(Transactions);
  });

  it('can be instantiated', () => {
    let transactions = new Transactions();
    assert(transactions instanceof Transactions);
  });

  it('has a list member', () => {
    let transactions = new Transactions();
    assert.deepEqual(transactions.list, []);
  });

  it('resolves to empty list without any transactions', () => {
    let transactions = new Transactions();
    let resolution = transactions.getResolution();
    assert.deepEqual(resolution, []);
  });

});
