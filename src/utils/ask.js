const askPromise = require('./askPromise');

module.exports = async function ask(variants) {
    let result, answer;
    const askString = variants
        .reduce((result, variant, index) => 
            result += `${index})${variant[0]}\r\n`, '');

    //Ask while client doesn't select exist variant
    while (!result) {
        answer = +await askPromise(askString);
        result = variants[answer];
    }

    //If selected variant doesn't have a child
    if (!result[1]) return [answer];
    else {
        const subResult = await ask([['Назад'], ...result[1]]);
        //If subResult = Назад then return to back
        return !subResult[0] ? ask(variants)
            : [answer, ...[--subResult[0], ...subResult.slice(1)]];
    }
};