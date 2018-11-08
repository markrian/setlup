import { parseLine } from '../../src/parser';


describe('parser', function () {
    test('can parse a simple line', function () {
        expect(parseLine('gary spent 114.20')).toEqual(
            { creditor: 'Gary', amount: 114.2, debtors: ['*'] });
    });

    test('it throws an error on a malformed line', function () {
        expect(function () {
            parseLine('nonsense goes here, foo');
        }).toThrow('Parsing error');
    });

    test('it throws an error on a malformed line', function () {
        expect(function () {
            parseLine('a did 4');
        }).toThrow('Parsing error');
    });

    test('can parse a simple line with excess whitespace', function () {
        expect(parseLine('  gary   spent   114.20  ')).toEqual(
            { creditor: 'Gary', amount: 114.2, debtors: ['*'] });
    });

    test('can parse a simple line with debtors', function () {
        expect(parseLine('gary spent 400 for peter, mike, lucy')).toEqual(
            { creditor: 'Gary', amount: 400, debtors: ['Peter', 'Mike', 'Lucy'] });
    });

    test('can parse a simple line with a misleadingly named creditor', function () {
        expect(parseLine('fordspenth spent 114.20')).toEqual(
            { creditor: 'Fordspenth', amount: 114.2, debtors: ['*'] });
    });

    test('should ignore duplicate debtors', function () {
        expect(parseLine('foo spent 10 for bar, qux, bar')).toEqual(
            { creditor: 'Foo', amount: 10, debtors: ['Bar', 'Qux'] });
    });

    test(`should normalise peoples' names`, function () {
        expect(parseLine('foo spent 10 for Foo, qux  yo, BAZ-FOO man')).toEqual(
            { creditor: 'Foo', amount: 10, debtors: ['Foo', 'Qux Yo', 'Baz-Foo Man']});
    });

    test('should throw on invalid number', function () {
        expect(function () {
            parseLine('a spent 4xyz');
        }).toThrow('Parsing error');
    });
});
