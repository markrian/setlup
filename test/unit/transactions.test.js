import { assert } from 'chai';
import _ from 'lodash';

import {
    randomNames,
    makeTransaction,
    transactionFromTuple,
    repeat,
} from '../support/transactions-helpers';

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

    it('returns balances which sum to zero', function () {
        transactions.add(...repeat(makeTransaction, 3));
        let balances = transactions.getBalances();

        let balancesList = Object.keys(balances).map(key => balances[key]);
        let balancesSum = balancesList.reduce((a, b) => a + b, 0);
        assert.closeTo(balancesSum, 0, 1e-10);
    });

    it('should return the same number of balances as there are people', function () {
        let transaction = makeTransaction();
        transactions.add(transaction);
        let people = transactions.getPeople();
        let balances = transactions.getBalances();

        assert.equal(people.length, Object.keys(balances).length);
    });

    it('resolves one transaction to its inverse', function () {
        let transaction = makeTransaction({numDebtors: 1});
        transactions.add(transaction);
        var inverseTransaction = {
            creditor: transaction.debtors[0],
            amount: transaction.amount,
            debtors: [transaction.creditor],
        };

        assert.deepEqual(transactions.getResolution(), [inverseTransaction]);
    });

    it('returns the minimal resolution', function () {
        let chainOfTransactions = [
            { creditor: 'a', amount: 1, debtors: ['b'] },
            { creditor: 'b', amount: 1, debtors: ['c'] },
            { creditor: 'c', amount: 1, debtors: ['d'] },
        ];
        transactions.add(...chainOfTransactions);

        assert.deepEqual(transactions.getResolution(), [{
            creditor: 'c', amount: 1, debtors: ['a']
        }]);
    });

    it('returns an empty resolution if all transactions are balanced', function () {
        let balancedTransactions = [
            { creditor: 'a', amount: 1, debtors: ['b'] },
            { creditor: 'b', amount: 1, debtors: ['c'] },
            { creditor: 'c', amount: 1, debtors: ['a'] },
        ];
        transactions.add(...balancedTransactions);

        assert.deepEqual(transactions.getResolution(), []);
    });

});
