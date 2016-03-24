import { assert } from 'chai';

import { parseLine } from '../../src/parser';


describe('parser', function () {
    it('can parse a simple line', function () {
        assert.deepEqual(parseLine('gary spent 114.20'),
            { creditor: 'gary', amount: 114.2, debtors: ['*'] });
    });

    it('can parse a simple line with excess whitespace', function () {
        assert.deepEqual(parseLine('  gary   spent   114.20  '),
            { creditor: 'gary', amount: 114.2, debtors: ['*'] });
    });

    it('can parse a simple line with debtors', function () {
        assert.deepEqual(parseLine('gary spent 400 for peter, mike, lucy'),
            { creditor: 'gary', amount: 400, debtors: ['peter', 'mike', 'lucy'] });
    });
});
