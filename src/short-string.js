// import uniq from 'lodash/uniq';
import Transactions from './transactions';

export function toShortString(transactions) {
    if (transactions.length === 0) {
        return '';
    }

    const tx = new Transactions();
    tx.add(...transactions);
    const people = tx.getPeople();

    return people +
        ':' +
        transactions
            .map(txn => transactionToString(txn, people))
            .join(':');
}

function transactionToString(transaction, people) {
    const creditorIndex = people.indexOf(transaction.creditor);
    let debtorIndices;
    if (isEveryone(transaction.debtors)) {
        debtorIndices = []
    } else {
        debtorIndices = transaction.debtors.map(debtor => people.indexOf(debtor));
    }
    return [
        creditorIndex,
        transaction.amount,
        ...debtorIndices,
    ].join(',');
}

export function fromShortString(hash) {
    if (hash.length === 0) {
        return [];
    }

    const [rawPeople, ...rawTransactions] = hash.split(':');
    const people = rawPeople.split(',');
    const transactions = rawTransactions.map(rawTxn => {
        const parts = rawTxn.split(',');
        const rawDebtors = parts.slice(2);
        let debtors;

        if (rawDebtors.length === 0) {
            debtors = ['*'];
        } else {
            debtors = rawDebtors.map(i => people[i]);
        }

        return {
            creditor: people[parts[0]],
            amount: Number(parts[1]),
            debtors,
        }
    });

    return transactions;
}

function isEveryone(debtors) {
    return debtors.length === 1 && debtors[0] === '*';
}
