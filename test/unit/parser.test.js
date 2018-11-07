import { parseLine } from '../../src/parser';


describe('parser', function () {
    test('can parse a simple line', function () {
        expect(parseLine('gary spent 114.20')).toEqual(
            { creditor: 'gary', amount: 114.2, debtors: ['*'] });
    });

    test('it throws an error on a malformed line', function () {
        expect(function () {
            parseLine('nonsense goes here, foo');
        }).toThrow('Parsing error');
    });

    test('can parse a simple line with excess whitespace', function () {
        expect(parseLine('  gary   spent   114.20  ')).toEqual(
            { creditor: 'gary', amount: 114.2, debtors: ['*'] });
    });

    test('can parse a simple line with debtors', function () {
        expect(parseLine('gary spent 400 for peter, mike, lucy')).toEqual(
            { creditor: 'gary', amount: 400, debtors: ['peter', 'mike', 'lucy'] });
    });

    test('can parse a simple line with a misleadingly named creditor', function () {
        expect(parseLine('fordspenth spent 114.20')).toEqual(
            { creditor: 'fordspenth', amount: 114.2, debtors: ['*'] });
    });

    test('should ignore duplicate debtors', function () {
        expect(parseLine('foo spent 10 for bar, qux, bar')).toEqual(
            { creditor: 'foo', amount: 10, debtors: ['bar', 'qux'] });
    });
});
