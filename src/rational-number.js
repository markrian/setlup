export default class RationalNumber {

    constructor(numerator = 0, denominator = 1) {
        this.numerator = numerator;
        this.denominator = denominator;
    }

    valueOf() {
        return this.numerator / this.denominator;
    }

}
