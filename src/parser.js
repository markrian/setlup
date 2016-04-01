export function parseLine(line) {
    const spent = ' spent ';
    const for_ = ' for ';

    const spentPos = line.indexOf(spent);
    const creditor = line.slice(0, spentPos).trim();
    const amount = parseFloat(line.slice(spentPos + spent.length));

    const forPos = line.indexOf(for_);
    let debtors = ['*'];
    if (forPos > -1) {
        debtors = line.slice(forPos + for_.length).split(',').map(d => d.trim());
    }

    if (creditor && debtors.length && !isNaN(amount)) {
        return { creditor, amount, debtors }
    } else {
        throw new Error('Parsing error');
    }
}
