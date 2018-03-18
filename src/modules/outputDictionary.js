const fs = require('fs');
const pathParser = require('path').parse;
const ask = require('../utils/askPromise');
const splitArrayBy = require('../utils/splitArrayBy');

module.exports = [async () => {
    const answer = +await ask('Введите максимальное количество слов в результирующей таблице: ') || 10;
    const translate = JSON.parse(fs.readFileSync(global.dictionary));
    const resp = outputTransl(translate, answer);
    console.log('Записано');
  }];
  

const outputTransl = (translate, maxWordCount) => {
  const splitted = splitArrayBy(Object.entries(translate), lastSubArray => lastSubArray.length >= maxWordCount);
  const result = splitted.map(part => `<tbody>${part.map(word => `<tr><td>${word.join(' - ')}</td></tr>`).join('')}</tbody>`).join('');
  fs.writeFileSync(`${__dirname}/../../work/outputText/${global.dictionaryName}.html`, `<link rel="stylesheet" href="./style.css"><table>${result}</table>`);
}