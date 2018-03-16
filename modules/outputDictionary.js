const fs = require('fs');
const pathParser = require('path').parse;
const ask = require('./askPromise');

module.exports = [async () => {
    const answer = +await ask('Введите максимальное количество слов в результирующей таблице: ') || 10;
    const translate = require(global.dictionary);
    const resp = outputTransl(translate, answer);
    console.log('Записано');
  }];
  
const splitByCount = (array, splitCount) => {
  return array.reduce((result, item) => {
    let lastArray = result[result.length-1];
    if(!lastArray || lastArray.length >= splitCount) {
      lastArray = [];
      result.push(lastArray);
    }
    lastArray.push(item);
    return result;
  }, []);
}

const outputTransl = (translate, maxWordCount) => {
  const path = pathParser(global.dictionary);
  const splitted = splitByCount(Object.entries(translate), maxWordCount);
  const result = splitted.map(part => `<tbody>${part.map(word => `<tr><td>${word.join(' - ')}</td></tr>`).join('')}</tbody>`).join('');
  fs.writeFileSync(`./outputText/${path.name}.html`, `<link rel="stylesheet" href="./style.css"><table>${result}</table>`);
}