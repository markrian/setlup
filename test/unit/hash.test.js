import { toHash, fromHash } from '../../src/hash';
import { transactionFromTuple as txn } from '../support/transactions-helpers';


describe('toHash', function () {
    const tests = [{
        description: 'should handle no transactions',
        transactions: [],
        expected: '',
    }, {
        description: 'should handle a simple transaction',
        transactions: [txn('bob', 10, ['*'])],
        expected: 'bob:0,10,*',
    }, {
        description: 'should handle a simple transaction with named debtors',
        transactions: [txn('bob', 10, ['alice', 'charlie'])],
        expected: 'bob,alice,charlie:0,10,1,2',
    }, {
        description: 'should handle multiple transactions',
        transactions: [
            txn('a', 10, ['b', 'c']),
            txn('b', 45.4, ['c', 'd']),
            txn('c', .9, ['d', 'e']),
        ],
        expected: 'a,b,c,d,e:0,10,1,2:1,45.4,2,3:2,0.9,3,4',
    }];

    tests.forEach(({ description, transactions, expected, skip }) => {
        const testFn = skip ? test.skip : test;
        testFn(description, () => {
            expect(toHash(transactions)).toEqual(expected);
        });
    });
});


describe('fromHash', function () {
    const tests = [{
        description: 'should handle empty hash',
        hash: '',
        expected: [],
    }, {
        description: 'should handle a simple transaction',
        hash: 'bob:0,10,*',
        expected: [txn('bob', 10, ['*'])],
    }, {
        description: 'should handle multiple transactions',
        hash: 'foo,bar,qux:0,10,2:1,100,*',
        expected: [
            txn('foo', 10, ['qux']),
            txn('bar', 100, ['*']),
        ],
    }];

    tests.forEach(({ description, hash, expected, skip }) => {
        const testFn = skip ? test.skip : test;
        testFn(description, () => {
            expect(fromHash(hash)).toEqual(expected);
        });
    });
});


describe('roundtrip', function () {
    const hashes = [
        'bob:0,1,*',
        'Foo Bar,Baz!:0,100,*:1,100,0',
    ];

    hashes.forEach(hash => {
        test('roundtrip ' + hash, () => {
            expect(toHash(fromHash(hash))).toEqual(hash);
        });
    });

    const transactions = [
        [txn('bob', 10, ['*'])],
        [
            txn('bob', 10, ['*']),
            txn('charlie', 10, ['alice', 'charlie']),
        ],
    ];

    transactions.forEach(txns => {
        test('roundtrip ' + JSON.stringify(txns), () => {
            expect(fromHash(toHash(txns))).toEqual(txns);
        });
    });
});
