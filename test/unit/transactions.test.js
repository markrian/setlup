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

    it('can return the balances of each person', function () {
        let transaction = makeTransaction();
        // use the same tx twice to make calculating expected result easier
        transactions.add(transaction, transaction);
        let balances = transactions.getBalances();
        let expectedCreditorBalance = -transaction.amount * 2;

        assert.strictEqual(balances[transaction.creditor], expectedCreditorBalance);

        let people = transactions.getPeople();
        let onlyDebtors = people.filter(person => person !== transaction.creditor);
        let expectedDebt = transaction.amount / onlyDebtors.length * 2;

        onlyDebtors.forEach((debtor, i, debtors) => {
            assert.strictEqual(
                balances[debtor], expectedDebt,
                `"${debtor}" expected to have balance of ${expectedDebt},
                but has ${balances[debtor]}. Transactions:
                ${JSON.stringify(transactions.list, null, 2)}`);
        });
    });

    it('should return the same number of balances as there are people', function () {
        let transaction = makeTransaction();
        transactions.add(transaction);
        let people = transactions.getPeople();
        let balances = transactions.getBalances();

        assert.equal(people.length, Object.keys(balances).length);
    });

    it.skip('resolves one transaction to its inverse', function () {
        let transaction = makeTransaction();
        transactions.add(transaction);

        assert.deepEqual(transactions.getResolution(), transaction);
    });

});

function makeTransaction() {
    let debtors = _.unique(repeat(
        chance.first.bind(chance),
        chance.integer({ min: 1, max: 10 })
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
