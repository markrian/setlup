import chai from 'chai';
let assert = chai.assert

import Transactions from '../../app/transactions';


describe('Transactions', () => {

  it('exists', () => {
    assert.ok(Transactions);
  });

  it('can be instantiated', () => {
    let transactions = new Transactions();
    assert.instanceOf(transactions, Transactions);
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
