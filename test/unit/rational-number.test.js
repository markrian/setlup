import { assert } from 'chai';
import _ from 'lodash';

import RationalNumber from '../../src/rational-number';


describe('RationalNumber', function () {

    it('can be instantiated', function () {
        let r = new RationalNumber(0, 1);
        assertRational(r, 0, 1);
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
            assertRational(r, test[1][0], test[1][1]);
        });
    });

    it('can be instantiated with a number', function () {
        let value = 3.45;
        let r = RationalNumber.fromNumber(value);

        assertRational(r, 69, 20);
    });

    it('can be added to a regular number', function () {
        assert.strictEqual(new RationalNumber() + 2.3, 2.3);
    });

    it('has an add method which returns a new instance of the sum', function () {
        let r = new RationalNumber(100, 16);
        let other = new RationalNumber(1, 16);
        let sum = r.add(other);

        assertRational(sum, 101, 16);
        assert.notStrictEqual(r, sum);
    });

    it('has a subtract method which returns a new instance of the difference', function () {
        let r = new RationalNumber(100, 16);
        let other = new RationalNumber(1, 16);
        let diff = r.subtract(other);

        assertRational(diff, 99, 16);
        assert.notStrictEqual(r, diff);
    });

    it('has a multiply method which returns a new instance of the product', function () {
        let r = new RationalNumber(100, 16);
        let other = new RationalNumber(1, 16);
        let product = r.multiply(other);

        assertRational(product, 25, 64);
        assert.notStrictEqual(r, product);
    });

    it('has a divide method which returns a new instance of the quotient', function () {
        let r = new RationalNumber(100, 16);
        let other = new RationalNumber(1, 16);
        let quotient = r.divide(other);

        assertRational(quotient, 100, 1);
        assert.notStrictEqual(r, quotient);
    });

    it('has an abs method which returns a new instance of the absolute value', function () {
        let r = new RationalNumber(-100, 16);
        let abs = r.abs();

        assertRational(abs, 25, 4);
        assert.notStrictEqual(r, abs);
    });

    function assertRational(rational, numerator, denominator) {
        assert.strictEqual(rational.numerator, numerator);
        assert.strictEqual(rational.denominator, denominator);
        assert.strictEqual(rational.valueOf(), numerator / denominator);
    }

});
