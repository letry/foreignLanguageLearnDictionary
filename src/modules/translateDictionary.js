const fs = require('fs');
const https = require('https');
const pathParser = require('path').parse;
const request = require('request-promise-native');
const flattendeep = require('lodash.flattendeep');
const splitArrayBy = require('../utils/splitArrayBy');

module.exports = [async () => {
    const allCountWords = JSON.parse(fs.readFileSync(global.dictionary));
    const words = Object.keys(allCountWords);
    const translate = flattendeep(await getTranslate(words));
    const translObject = words.reduce((result, item, i) => 
      Object.assign(result, {[item]: translate[i]}), {});

    const parsedPath = pathParser(global.dictionary);
    fs.writeFileSync(`${[parsedPath.dir, parsedPath.name].join('/')}Translate.json`, JSON.stringify(translObject));
    console.log('Переведено\n');
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
    sendTranslRequest(stringArr.join('|| '))
      .then(data => {
        console.log(stringArr);
        return data.text[0].split('|').filter(str => str).map(word => word.trim())
      })
  ));
}

const sendTranslRequest = text => request({
  method: 'POST',
  uri: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
  qs: {
    lang: 'en-ru',
    key: 'trnsl.1.1.20170502T113730Z.a2c8556b9ab76555.89dd8f0846830d673e2bf086d97ee194450509b9'
  },
  form: {text},
  json: true
});
