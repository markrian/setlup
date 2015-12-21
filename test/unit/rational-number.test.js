import { assert } from 'chai';
import _ from 'lodash';

import RationalNumber from '../../src/rational-number';


describe('RationalNumber', function () {

    it('can be instantiated', function () {
        let r = new RationalNumber(0, 1);
        assert.strictEqual(r.numerator, 0);
        assert.strictEqual(r.denominator, 1);
        assert.strictEqual(r.valueOf(), 0);
    });

    it(`throws when not instantiated with 'new'`, function () {
        assert.throws(() => RationalNumber(0, 1));
    });

    it('simplifies itself', function () {
        let tests = [
            [[100, 50], [2, 1]],
            [[100, 16], [25, 4]],
            [[100, 17], [100, 17]],
            [[528, 840], [22, 35]],
            [[-50, 12], [-25, 6]],
            [[50, -12], [-25, 6]],
            [[-50, -12], [25, 6]],
        ];

        tests.forEach(test => {
            let r = new RationalNumber(test[0][0], test[0][1]);
            assert.strictEqual(r.numerator, test[1][0]);
            assert.strictEqual(r.denominator, test[1][1]);
            assert.strictEqual(r.valueOf(), test[0][0] / test[0][1]);
        });
    });

    it('can be instantiated with a number', function () {
        let value = 2;
        let r = RationalNumber.fromNumber(value);

        assert.strictEqual(r.numerator, value);
        assert.strictEqual(r.denominator, 1);
        assert.strictEqual(r.valueOf(), value);
    });

    it('can be instantiated with a instance of RationalNumber');

    it('can be added to a regular number', function () {
        assert.strictEqual(new RationalNumber() + 2.3, 2.3);
    });

});
