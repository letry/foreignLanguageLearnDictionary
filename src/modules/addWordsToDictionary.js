const fs = require('fs');
const flattenDeep = require('lodash.flattendeep');
const askPromise = require('../utils/askPromise');
const fileSelector = require('../utils/fileSelector');
const getFileTexts = require('../utils/getFileTexts');
const getCountRepeatMap = require('../utils/getCountRepeatMap');

module.exports = [
    plainText => {
        const words = plainText.split(/[^ a-zA-Z]/).join('').split(' ')
            .filter(word => word).map(word => word.toLowerCase());

        const repeatMap = getCountRepeatMap(words);

        addWordsToDictionary(repeatMap);

        console.log('Добавлено', repeatMap.size, 'слов');
    }, [
        [() => askPromise('Вводите слова:')],
        [async () => {
            const inputDirPath = global.paths.input;
            const selectedPath = await fileSelector(inputDirPath, [['Все']]);
            const text = getFileTexts(
                selectedPath[0] === 'Все' ? inputDirPath
                : [inputDirPath, ...selectedPath].join('/'));

            return flattenDeep(text).join(' ');
        }]
    ]
];

const addWordsToDictionary = repeatMap => {
    const allDict = JSON.parse(fs.readFileSync(global.dictionary));
    
    for (let [word, count] of repeatMap.entries()) 
      allDict[word] = count + (allDict[word] || 0);
    
    fs.writeFileSync(global.dictionary, JSON.stringify(allDict, 0, '\t'));
}