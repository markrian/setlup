import _ from 'lodash';
import chance from '../support/chance';

const NAMES = _.uniq(repeat(chance.name.bind(chance), 20));


function randomNames(count = 10) {
    if (count > 10 || count < 1) {
        throw new Error(`${count} must be between 1 and 10 inclusive`);
    }
    let result = chance.pick(NAMES, count);
    return count === 1 ? [result] : result;
}

function randomName() {
    return randomNames(1)[0];
}

function makeTransaction(options = {}) {
    let min = options.numDebtors || 1;
    let max = options.numDebtors || 10;
    let numDebtors = chance.integer({ min, max });
    return {
        creditor: randomName(),
        amount: chance.floating({ min: 0.1, max: 1000 }),
        debtors: randomNames(numDebtors),
    };
}

function transactionFromTuple(creditor, amount, debtors) {
    return { creditor, amount, debtors };
}

function repeat(fn, n) {
    let result = [];
    while (n--) {
        result.push(fn());
    }
    return result;
}

export { randomNames, makeTransaction, transactionFromTuple, repeat };
