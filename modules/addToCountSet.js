const fs = require('fs');
const pathParser = require('path').parse;
const askPromise = require('./askPromise');
const asker = require('./ask');
const flattenDeep = require('lodash.flattendeep');
const flatTree = require('./flatTree');

module.exports = [
    plainText => {
        const words = plainText.split(/[^ a-zA-Z]/)
            .join('').split(' ').filter(word => word);
        const countObj = getCountObj(words, { minLng : 3 });

        console.log('Добавлено', addCountDict(countObj), 'слов');
    }, [
        [() => askPromise('Вводите слова:')],
        [async () => {
            const inputDirPath = `${__dirname}/../inputTexts`; //1 because 0 is rootName
            const options = [['Все'], ...makeFileArrayTree(inputDirPath)[1]]; 
            
            console.log('Выберите файл:');
            const answer = await asker(options);
            const selectedPath = flatTree(options, answer, 0, 1);

            const text = getFileTexts(
                !answer[0] ? inputDirPath
                : [inputDirPath, ...selectedPath].join('/'));

            return flattenDeep(text).join(' ');
        }]
    ]
];

const makeFileArrayTree = path => {
    const isFile = !fs.statSync(path).isDirectory();
    const {name, ext} = pathParser(path);
    const toConcat = isFile ? [] : [fs.readdirSync(path)
      .map(name => makeFileArrayTree(path + '/' + name))];
      
    return [name + ext, ...toConcat];
}

const getFileTexts = path =>
    !fs.statSync(path).isDirectory()
        ? [fs.readFileSync(path)]
        : fs.readdirSync(path)
            .map(name => getFileTexts(path + '/' + name));
  
function getCountObj(words, {minLng = 1, maxLng = 14}) {
    console.time('Подсчёт слов');
    let obj = {};
    
    for (let i = 0; i < words.length; ++i) {
      if (words[i].length < minLng || words[i].length > maxLng) continue;
      
      let word = words[i].toLowerCase();
      obj[word] = obj[word] ? obj[word] + 1 : 1;
    }

    console.timeEnd('Подсчёт слов');
    return obj;
}

function addCountDict(countObj, pathToDict = './dictionaries/allCountWords.json') {
    let allDict = JSON.parse(fs.readFileSync(pathToDict)), i = 0;
    
    for (let word in countObj) {
      allDict[word] = allDict[word] 
        ? allDict[word] + countObj[word] : countObj[word];
      ++i;
    }
    
    fs.writeFileSync(pathToDict, JSON.stringify(allDict));
    return i;
}