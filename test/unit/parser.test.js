import { assert } from 'chai';

import { parseLine } from '../../src/parser';


describe('parser', function () {
    it('can parse a simple line', function () {
        assert.deepEqual(parseLine('gary spent 114.20'),
            { creditor: 'gary', amount: 114.2, debtors: ['*'] });
    });
});