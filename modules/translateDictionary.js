const fs = require('fs');
const https = require('https');
const pathParser = require('path').parse;
const request = require('request-promise-native');
const flattendeep = require('lodash.flattendeep');

module.exports = [async () => {
    const allCountWords = JSON.parse(fs.readFileSync(global.dictionary));
    const words = Object.keys(allCountWords);
    const translate = flattendeep(await getTranslate(words));
    const translObject = words.reduce((result, item, i) => Object.assign(result, {[item]: translate[i]}), {});

    const parsedPath = pathParser(global.dictionary);
    fs.writeFileSync(`${[parsedPath.dir, parsedPath.name].join('/')}Translate.json`, JSON.stringify(translObject));
    console.log('Переведено\n');
}];

const StringArray = class extends Array {
  constructor() {
    super();
    this.innerStringLength = 0;    
  }
  push(str) {
    this.innerStringLength += str.length;
    return super.push(str);
  }
}

const splitArray = (stringArr, symbolCount) => 
  stringArr.reduce((resultArr, string) => {
    let lastStringArray = resultArr[resultArr.length - 1];

    if (!lastStringArray || lastStringArray.innerStringLength + string.length > symbolCount) {
      lastStringArray = new StringArray();
      resultArr.push(lastStringArray);      
    }

    lastStringArray.push(string);
    return resultArr;
  }, []);


const getTranslate = words => 
  Promise.all(splitArray(words, 5e3).map(stringArr => 
    translReq(stringArr.join(','))
      .then(words => JSON.parse(words).text[0].split(','))
  ));

const translReq = text => request({
  method: 'POST',
  uri: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
  qs: {
    lang: 'en-ru',
    key: 'trnsl.1.1.20170502T113730Z.a2c8556b9ab76555.89dd8f0846830d673e2bf086d97ee194450509b9'
  },
  form: {text}
});