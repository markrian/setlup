export function parseLine(line) {
    const spent = 'spent';
    const spentPos = line.indexOf(spent);
    const creditor = line.slice(0, spentPos).trim();
    const amount = parseFloat(line.slice(spentPos + spent.length));

    return { creditor, amount, debtors: ['*'] }
}
