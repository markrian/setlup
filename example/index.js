import { parseLine } from '../src/parser';
import Transactions from '../src/transactions';

var resultsEl = document.querySelector('#results');

var textarea = document.querySelector('textarea');

textarea.addEventListener('input', function () {
    try {
        var resolvingTransactions = resultsFromTextarea(this);
    } catch (e) {
        resultsEl.innerHTML = String(e);
        return;
    }

    resultsEl.innerHTML = resolvingTransactions.map(englishTransaction).join('<br>');
});

textarea.dispatchEvent(new Event('input'));

function resultsFromTextarea(textarea) {
    var items = [];
    textarea.value.split('\n').forEach(function (line, index) {
        line = line.trim();
        if (!line) return;
        items.push(parseLine(line));
    });


    var transactions = new Transactions();
    transactions.add.apply(transactions, items);
    return transactions.getResolution({ primitive: true });
}

function englishTransaction(transaction) {
    return [
        transaction.creditor,
        'should pay',
        transaction.debtors[0],
        transaction.amount.toFixed(2),
    ].join(' ');
}
