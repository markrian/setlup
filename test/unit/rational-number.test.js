import { assert } from 'chai';
import _ from 'lodash';

import RationalNumber from '../../src/rational-number';


describe('RationalNumber', function () {

    function makeRational(n) {
        return new RationalNumber(n);
    }

    it('can be instantiated and defaults to zero', function () {
        let r = makeRational();

        assert.strictEqual(r.numerator, 0);
        assert.strictEqual(r.denominator, 1);
        assert.strictEqual(r.valueOf(), 0);
    });

    it('can be instantiated with a number', function () {
        let value = 2;
        let r = makeRational(value);

        assert.strictEqual(r.numerator, value);
        assert.strictEqual(r.denominator, 1);
        assert.strictEqual(r.valueOf(), value);
    });

    it('can be instantiated with a string', function () {
        let value = "2";
        let r = makeRational(value);

        assert.strictEqual(r.numerator, Number(value));
        assert.strictEqual(r.denominator, 1);
        assert.strictEqual(r.valueOf(), Number(value));
    });

    it('can be instantiated with a numerator and denominator');

    it('can be instantiated with a instance of RationalNumber');

    it('can be added to a regular number', function () {
        assert.strictEqual(makeRational(1.2) + 2.3, 3.5);
    });

});
