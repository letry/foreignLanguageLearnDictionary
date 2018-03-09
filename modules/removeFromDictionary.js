const fs = require('fs');
const askPromise = require('./askPromise');
const flattenDeep = require('lodash.flattendeep');
const fileSelector = require('./fileSelector');
const getFileTexts = require('./getFileTexts');

module.exports = [
    plainText => {
        const words = plainText.split(/[^ a-zA-Z]/).join('')
            .split(' ').filter(word => word);

        removeWordsFromDictionary(words);
        console.log('Удалено', words.length, 'слов');
    }, [
        [() => askPromise('Вводите слова:')],
        [async () => {
            const inputDirPath = `${__dirname}/../inputTexts`;
            const selectedPath = await fileSelector(inputDirPath);
            const text = getFileTexts([inputDirPath, ...selectedPath].join('/'));
            return flattenDeep(text).join(' ');
        }]
    ]
];

const removeWordsFromDictionary = words => {
    let allDict = JSON.parse(fs.readFileSync(global.dictionary));
    for (let word of words) Reflect.deleteProperty(allDict, word);
    fs.writeFileSync(global.dictionary, JSON.stringify(allDict, 0, '\t'));
}