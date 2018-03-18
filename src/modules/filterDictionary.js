const fs = require('fs');
const ask = require('../utils/askPromise');
const objectFilter = require('../utils/objectFilter');

const ascending = [[() => 1], [() => -1]];
const askNumber = async () => {
    const answer = await ask('Введите число: ');
    return isNaN(+answer) ? askNumber() : answer;
}

module.exports = [
    async ({ascending, byValue}) => {
        const number = await askNumber();
        const dictionary = JSON.parse(fs.readFileSync(global.dictionary));
        const filtered = objectFilter(dictionary, keyVal => 
            !(number * ascending < (+keyVal[+byValue] || keyVal[+byValue].length) * ascending));

        fs.writeFileSync(global.dictionary, JSON.stringify(filtered));

        console.log('Отфильтровано', Object.keys(dictionary).length - Object.keys(filtered).length, 'слов');
    },
    [
        [ascending => ({ascending, byValue: false}), ascending],
        [ascending => ({ascending, byValue: true}), ascending]
    ]
]