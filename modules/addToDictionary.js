const fs = require('fs');
const askPromise = require('./askPromise');
const flattenDeep = require('lodash.flattendeep');
const fileSelector = require('./fileSelector');
const getFileTexts = require('./getFileTexts');

module.exports = [
    plainText => {
        const words = plainText.split(/[^ a-zA-Z]/)
            .join('').split(' ').filter(word => word);
        const countObj = getCountObj(words, { minLng : 3 });
        addWordsToDictionary(countObj);
        console.log('Добавлено', Object.keys(countObj).length, 'слов');
    }, [
        [() => askPromise('Вводите слова:')],
        [async () => {
            const inputDirPath = `${__dirname}/../inputTexts`;
            const selectedPath = await fileSelector(inputDirPath, [['Все']]);
            const text = getFileTexts(
                selectedPath[0] === 'Все' ? inputDirPath
                : [inputDirPath, ...selectedPath].join('/'));

            return flattenDeep(text).join(' ');
        }]
    ]
];
  
const getCountObj = (words, {minLng = 1, maxLng = 14}) => {
    console.time('Подсчёт повторяющихся слов');
    let obj = {};
    
    for(let word of words) {
      if (word.length < minLng || word.length > maxLng) continue;
      word = word.toLowerCase();
      obj[word] = obj[word] ? obj[word] + 1 : 1;
    }

    console.timeEnd('Подсчёт повторяющихся слов');
    return obj;
}

const addWordsToDictionary = countObj => {
    let allDict = JSON.parse(fs.readFileSync(global.dictionary));
    
    for (let word in countObj) 
      allDict[word] = allDict[word]
        ? allDict[word] + countObj[word] : countObj[word];
    
    fs.writeFileSync(global.dictionary, JSON.stringify(allDict, 0, '\t'));
}