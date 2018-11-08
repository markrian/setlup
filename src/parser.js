import uniq from 'lodash/uniq';

export function parseLine(line) {
    const spent = ' spent ';
    const for_ = ' for ';

    const spentPos = line.indexOf(spent);
    if (spentPos === -1) {
        throwParsingError();
    }

    const creditor = normaliseName(line.slice(0, spentPos).trim());
    const amount = parseFloat(line.slice(spentPos + spent.length));

    const forPos = line.indexOf(for_);
    let debtors = ['*'];
    if (forPos > -1) {
        debtors = uniq(line.slice(forPos + for_.length).split(',').map(d => d.trim()));
    }

    if (creditor && debtors.length && !isNaN(amount)) {
        return { creditor, amount, debtors: debtors.map(normaliseName) }
    } else {
        throwParsingError();
    }
}

function throwParsingError(line) {
    throw new Error(`Parsing error: "${line}" is invalid`);
}

function normaliseName(name) {
    return name
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(part =>
            part
                .split('-')
                .map(titleCase)
                .join('-')
        )
        .join(' ');
}

function titleCase(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}
