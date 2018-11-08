import { parseLine } from '../src/parser';
import Transactions from '../src/transactions';

const resultsEl = document.querySelector('#results');

const textarea = document.querySelector('textarea');

textarea.addEventListener('input', function () {
    const results = resultsFromTextarea(this);
    resultsEl.innerHTML = renderResults(results);
});

textarea.dispatchEvent(new Event('input'));

function resultsFromTextarea(textarea) {
    const results = textarea.value.split('\n').reduce((results, line, i) => {
        let result;
        line = line.trim();

        if (line.length === 0) {
            return results;
        }

        try {
            results.transactions.push(parseLine(line));
        } catch (e) {
            results.errors.push(String(e));
        }
        return results;
    }, { errors: [], transactions: [], resolution: [] });

    const transactions = new Transactions();
    transactions.add(...results.transactions);
    results.resolution.push(...transactions.getResolution({ primitive: true }));
    return results;
}

function englishTransaction(transaction) {
    return [
        transaction.creditor,
        'should pay',
        transaction.debtors[0],
        transaction.amount.toFixed(2),
    ].join(' ');
}

function renderResults({ errors, resolution }) {
    const parseErrors = renderListItems(errors, "parse-error");
    let actions = renderListItems(resolution.map(englishTransaction));
    if (actions.length === 0) {
        actions = "Nothing owed!";
    }
    const result = `<ul>${parseErrors}${actions}</ul>`;

    return result
}

function renderListItems(items, className = '') {
    return items.map(item => `<li class="${className}">${item}</li>`).join('');
}
