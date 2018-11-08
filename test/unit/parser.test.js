import { parseLine } from '../../src/parser';


describe('parser', function () {
    const validLines = [{
        description: 'can parse a simple line',
        line: 'gary spent 114.20',
        expected: { creditor: 'Gary', amount: 114.2, debtors: ['*'] },
    }, {
        description: 'can parse a simple line with excess whitespace',
        line: '  gary   spent   114.20  ',
        expected: { creditor: 'Gary', amount: 114.2, debtors: ['*'] },
    }, {
        description: 'can parse a simple line with debtors',
        line: 'gary spent 400 for peter, mike, lucy',
        expected: { creditor: 'Gary', amount: 400, debtors: ['Peter', 'Mike', 'Lucy'] },
    }, {
        description: 'can parse a simple line with a misleadingly named creditor',
        line: 'fordspenth spent 114.20',
        expected: { creditor: 'Fordspenth', amount: 114.2, debtors: ['*'] },
    }, {
        description: 'should ignore duplicate debtors',
        line: 'foo spent 10 for bar, qux, bar',
        expected: { creditor: 'Foo', amount: 10, debtors: ['Bar', 'Qux'] },
    }, {
        description: `should normalise peoples' names`,
        line: 'foo spent 10 for Foo, qux  yo, BAZ-FOO man',
        expected: { creditor: 'Foo', amount: 10, debtors: ['Foo', 'Qux Yo', 'Baz-Foo Man']},
    }, {
        description: 'should ignore everything after a # character',
        line: 'foo spent 10 for Foo, qux # yo, BAZ-FOO man',
        expected: { creditor: 'Foo', amount: 10, debtors: ['Foo', 'Qux']},
    }];

    validLines.forEach(({ description, line, expected }) => {
        test(description, () => {
            expect(parseLine(line)).toEqual(expected);
        });
    });

    const invalidLines = [
        ['nonsense', 'nonsense goes here, foo'],
        ['no spent keyword', 'a did 4'],
        ['invalid number', 'a spent 4xyz'],
        ['entirely commented out', '#a spent 10'],
    ];

    invalidLines.forEach(([description, line]) => {
        test(`line with ${description} should throw a parse error`, () => {
            expect(() => parseLine(line)).toThrow('Parsing error');
        });
    });
});
