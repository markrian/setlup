import uniq from 'lodash/uniq';
import bigRat from 'big-rational';

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

    test('has a list member', function () {
        expect(transactions.list).toBeInstanceOf(Array);
        expect(transactions.list).toHaveLength(0);
    });

    test('can add transactions which show up in the list member', function () {
        let transaction = makeTransaction();
        transactions.add(transaction);

        expect(transactions.getPrimitiveList()).toEqual([transaction]);

        let moreTransactions = repeat(makeTransaction, 2);
        transactions.add(...moreTransactions);

        expect(transactions.getPrimitiveList()).toEqual([transaction, ...moreTransactions]);
    });

    test('makes copies of added transactions', function () {
        let transaction = makeTransaction();
        transactions.add(transaction);

        let transactionInList = transactions.getPrimitiveList()[0];
        expect(transactionInList).toEqual(transaction);
        expect(transactionInList).not.toBe(transaction);
    });

    test('can list the people involved in all transactions', function () {
        let someTransactions = repeat(makeTransaction, 2);
        transactions.add(...someTransactions);
        let actual = uniq(transactions.getPeople().sort());
        let expected = uniq([
            someTransactions[0].creditor,
            someTransactions[1].creditor,
            ...someTransactions[0].debtors,
            ...someTransactions[1].debtors,
        ].sort())

        expect(actual).toEqual(expected);
    });

    test('interprets * in debtors to mean all people involved in all transactions', function () {
        let someTransactions = [
            transactionFromTuple('a', 100, ['*']),
            transactionFromTuple('b', 50, ['*']),
        ];
        transactions.add(...someTransactions);

        expect(transactions.getPeople()).toEqual(['a', 'b']);
        expect(transactions.getBalances({ primitive: true })).toEqual({
            'a': -25,
            'b': 25,
        });
        expect(transactions.getResolution({ primitive: true })).toEqual([
            transactionFromTuple('b', 25, ['a'])
        ]);
    });

    test('resolves to empty list without any transactions', function () {
        let resolution = transactions.getResolution();
        expect(resolution).toEqual([]);
    });

    test('can return the balances of each person', function () {
        let someTransactions = [
            transactionFromTuple('a', 45, ['a', 'b', 'c']),
            transactionFromTuple('b', 20, ['b', 'c']),
        ];
        transactions.add(...someTransactions);
        let balances = transactions.getBalances({ primitive: true });
        let expectedBalances = {
            'a': -30,
            'b': 5,
            'c': 25,
        };

        expect(balances).toEqual(expectedBalances);
    });

    test('returns balances which sum to zero', function () {
        transactions.add(...repeat(makeTransaction, 3));
        let balances = transactions.getBalances();

        let balancesList = Object.keys(balances).map(key => balances[key]);
        let balancesSum = balancesList.reduce((a, b) => a.add(b), bigRat());
        expect(balancesSum.valueOf()).toBe(0);
    });

    test(`doesn't charge debtors when the only debtor is the creditor`, function () {
        transactions.add(transactionFromTuple('a', 40, ['a']));
        expect(transactions.getPeople()).toEqual(['a']);
        expect(transactions.getBalances({ primitive: true })).toEqual({ 'a': 0 });
        expect(transactions.getResolution()).toEqual([]);
    });

    test('should return the same number of balances as there are people', function () {
        let transaction = makeTransaction();
        transactions.add(transaction);
        let people = transactions.getPeople();
        let balances = transactions.getBalances();

        expect(people).toHaveLength(Object.keys(balances).length);
    });

    test('resolves one transaction to its inverse', function () {
        let transaction = transactionFromTuple('a', 10, ['b']);
        transactions.add(transaction);
        var inverseTransaction = transactionFromTuple('b', 10, ['a']);
        let resolution = transactions.getResolution({ primitive: true });

        expect(resolution).toEqual([inverseTransaction]);
    });

    test('returns the minimal resolution', function () {
        let chainOfTransactions = [
            { creditor: 'a', amount: 1, debtors: ['b'] },
            { creditor: 'b', amount: 1, debtors: ['c'] },
            { creditor: 'c', amount: 1, debtors: ['d'] },
        ];
        transactions.add(...chainOfTransactions);
        let resolution = transactions.getResolution({ primitive: true });

        expect(resolution).toEqual([{
            creditor: 'd', amount: 1, debtors: ['a']
        }]);
    });

    test('does not return too many resolving transactions', function () {
        let manyTransactions = repeat(makeTransaction, 50);
        transactions.add(...manyTransactions);
        let numPeople = transactions.getPeople().length;
        let numResolvingTransactions = transactions.getResolution().length;

        expect(numResolvingTransactions).toBeLessThan(numPeople);
    });

    describe('when applying the resolution', function () {
        test('should return an empty resolution, having not suffered rounding errors', function () {
            let transaction = transactionFromTuple('a', 10, ['a', 'b', 'c']);
            transactions.add(transaction);
            let resolution = transactions.getResolution();
            transactions.add(...resolution);

            expect(transactions.getResolution()).toEqual([]);

            let manyTransactions = repeat(makeTransaction, 50);
            transactions.add(...manyTransactions);
            resolution = transactions.getResolution();
            transactions.add(...resolution);

            expect(transactions.getResolution()).toEqual([]);
        });
    });

    test('returns an empty resolution if all transactions are balanced', function () {
        let balancedTransactions = [
            { creditor: 'a', amount: 1, debtors: ['b'] },
            { creditor: 'b', amount: 1, debtors: ['c'] },
            { creditor: 'c', amount: 1, debtors: ['a'] },
        ];
        transactions.add(...balancedTransactions);

        expect(transactions.getResolution()).toEqual([]);
    });

    test('can be stringified', function () {
        let someTransactions = [
            transactionFromTuple('Foo', 100, ['*']),
            transactionFromTuple('Bar Qux', 50, ['Foo', 'Whoever']),
        ];
        transactions.add(...someTransactions);
        expect(transactions.toString()).toEqual([
            'Foo spent 100',
            'Bar Qux spent 50 for Foo, Whoever',
        ].join('\n'));
    });
});
