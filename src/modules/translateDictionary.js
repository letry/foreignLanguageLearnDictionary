const fs = require('fs');
const https = require('https');
const pathParser = require('path').parse;
const request = require('request-promise-native');
const splitArrayBy = require('../utils/splitArrayBy');
const apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
const apiKey = 'trnsl.1.1.20170502T113730Z.a2c8556b9ab76555.89dd8f0846830d673e2bf086d97ee194450509b9';

module.exports = [async () => {
    const allCountWords = JSON.parse(fs.readFileSync(global.dictionary));
    const words = Object.keys(allCountWords);
    if (!words.length) return console.log('Словарь пуст');
    const translate = [].concat(...(await getTranslate(words)));
    const translObject = words.reduce((result, item, i) => 
      Object.assign(result, {[item]: translate[i]}), {});

    const parsedPath = pathParser(global.dictionary);
    fs.writeFileSync(`${[parsedPath.dir, parsedPath.name].join('/')}Translate.json`, JSON.stringify(translObject));
    console.log(`Переведено и сохранено в ${parsedPath.name}Translate.json. Перед выводом результата выберите этот словарь`);
}];

const splitByInnerStringsLength = (arrayOfString, maxSubArrayStringLength, addition) => {
  let lastStringArrayLength = 0;

  return splitArrayBy(arrayOfString, (lastSubArray, str) => {
    lastStringArrayLength += str.length + addition;
    return lastStringArrayLength > maxSubArrayStringLength 
      ? lastStringArrayLength = str.length + addition : false;
  });
}

const getTranslate = words => {
  const splitted = splitByInnerStringsLength(words, 1e4, 3); //max text length is 10000
  return Promise.all(splitted.map(stringArr => 
    sendTranslRequest(stringArr)
      .then(({text}) => text)
  ));
}

const sendTranslRequest = words => request({
  method: 'GET',
  uri: `${apiUrl}?key=${apiKey}&${words.map(word => `text=${word}`).join('&')}&lang=en-ru`,
  json: true
});
