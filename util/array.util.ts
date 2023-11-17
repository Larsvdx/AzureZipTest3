const equal = require('fast-deep-equal');

export function difference(base: Array<any>, comparer: Array<any>) {
    let result: any[] = [];
    base.forEach((value, index) => {
        if(!equal(value, comparer[index])) {
            result.push(value);
        }
    });

    return result
}
