import uniq from 'lodash/uniq';

export function parseLine(line, position = 0) {
    const cleanLine = line.toLowerCase().trim().replace(/\s+/g, ' ');
    const [creditor, rest] = cleanLine.split(' spent ');
    if (rest === undefined) {
        throwParsingError(line);
    }

    let endOfAmount = rest.indexOf(' ');
    if (endOfAmount === -1) {
        endOfAmount = rest.length;
    }

    const amount = Number(rest.slice(0, endOfAmount));
    if (typeof amount !== 'number' || !isFinite(amount)) {
        throwParsingError(line);
    }

    const debtors = rest
        .slice(endOfAmount)
        .replace(/for /, '')
        .split(',')
        .filter(s => s.length > 0);

    if (debtors.length === 0) {
        debtors.push('*');
    }

    return {
        creditor: normaliseName(creditor),
        amount,
        debtors: uniq(debtors).map(normaliseName),
    };
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
