export default class RationalNumber {

    constructor(numerator = 0, denominator = 1) {
        let simplified = simplify(numerator, denominator);
        Object.assign(this, simplified);
    }

    add(other) {
        return new RationalNumber(
            this.numerator * other.denominator + other.numerator * this.denominator,
            this.denominator * other.denominator);
    }

    subtract(other) {
        return new RationalNumber(
            this.numerator * other.denominator - other.numerator * this.denominator,
            this.denominator * other.denominator);
    }

    multiply(other) {
        return new RationalNumber(
            this.numerator * other.numerator,
            this.denominator * other.denominator);
    }

    divide(other) {
        return new RationalNumber(
            this.numerator * other.denominator,
            this.denominator * other.numerator);
    }

    abs() {
        return new RationalNumber(Math.abs(this.numerator), this.denominator);
    }

    valueOf() {
        return this.numerator / this.denominator;
    }

    static fromNumber(float) {
        let numerator, denominator, factor
        if (float === parseInt(float)) {
            factor = 1;
        } else {
            let asString = float.toString();
            let numDecimals = asString.split('.')[1].length;
            factor = Math.pow(10, numDecimals);
        }

        return new RationalNumber(float * factor, factor);
    }

}

/**
 * @param {number} numerator
 * @param {number} denominator
 * @returns {Object} Simplified { numerator, denominator }
 */
function simplify(numerator, denominator) {
    var commonDivisor = gcd(numerator, denominator);

    if (numerator < 0 !== denominator < 0) {
        numerator = -Math.abs(numerator);
        denominator = Math.abs(denominator);
        commonDivisor = Math.abs(commonDivisor);
    }

    return {
        numerator: numerator / commonDivisor,
        denominator: denominator / commonDivisor,
    }
}

/**
 * gcd(a, 0) = a
 * gcd(a, b) = gcd(b, a mod b)
 */
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}
