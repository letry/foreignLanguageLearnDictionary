const fs = require('fs');
const https = require('https');

module.exports = function translCountSet() {
    let allCountWords = require('./dictionaries/allCountWords'),
        freqArr = getFreqArr(allCountWords);
    
    getTranslate(
      freqArr,
      concutTransl.bind(null, freqArr, [write])
    );
    
    function write(transl) {
      fs.writeFileSync(
        './dictionaries/allTranslWords.json',
        JSON.stringify(transl)
      );
      console.log('Переведено\n');
      ask();
    }
    
  }
  
  
  
  
  function getFreqArr(fObj) {
    console.time('Создание частотного массива');
    let fArr = [];
    
    for (let oWord in fObj) {
      if (fArr.length) {
        let key = fObj[oWord];
        
        for (let i = fArr.length - 1; i >= 0; --i) {
          if (fObj[ fArr[i] ] >= key) {
            fArr.splice(i+1, 0, oWord);
            break;
          } else if (i === 0) fArr.unshift(oWord);
        }
         
      } else fArr.push(oWord);
    }
    console.timeEnd('Создание частотного массива');
    return fArr;
  }
  
  function getTranslate(wrdAr, callback) {
    console.time('Получение перевода');
    let arLng = wrdAr.length,
        allLng = arLng * 20;
    
    if (allLng > 10000) {
      let parts = Math.ceil(allLng / 10000),
          step = Math.floor(arLng / parts),
          packages = [],
          translate = [],
          promises = [];
          
      for (let i = 0; i < arLng; i += step) {
        packages.push(wrdAr.slice(i, i + step));
      }
      
      for (let i = 0; i < packages.length; i++) {
        let body = packages[i].join('&text='),
            prom = translReq(body)
              .then((words) => translate[i] = JSON.parse(words).text)
              .catch((e) => {throw e});
        
        promises.push(prom);
      }
      
      Promise.all(promises)
        .then((trnsl) => {
          console.timeEnd('Получение перевода');
          callback([].concat(...trnsl));
        },
        (rej) => {
          throw 'Ошибка ответа: ' + rej;
        }
      );
      
    } else {
      let body = wrdAr.join('&text=');
      translReq(body)
        .then((trnsl) => {
          console.timeEnd('Получение перевода');
          callback([].concat(...trnsl));
        })
        .catch((e) => {throw e});
    }
    
    function translReq(body) {
      return new Promise(function(res, rej) {
        let path = '/api/v1.5/tr.json/translate',
            flags = '?lang=en-ru&key=',
            key = 'trnsl.1.1.20170502T113730Z.a2c8556b9ab76555.89dd8f0846830d673e2bf086d97ee194450509b9',
            options = {
              method: 'POST',
              hostname: 'translate.yandex.net',
              path: path + flags + key,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            },
            req = https.request(options, (resp) => {
              if (resp.statusCode == 200) {
                let data = '';
                resp.on('data', chunc => data += chunc);
                resp.on('end', () => res(data));
              } else {
                let data = '';
                resp.on('data', chunc => data += chunc);
                resp.on('end', () => rej(JSON.parse(data).message));
              }
            });
  
        req.write('text=' + body);
        req.end();
      });
    }
    
  }
  
  function concutTransl(words, callbacks, transl) {
    let allTransl = {};
              
    for (let i = 0; i < words.length; ++i) {
      if (words[i] === transl[i]) continue;
      allTransl[words[i]] = transl[i];
    }
    
    for (let i = 0; i < callbacks.length; ++i) {
      callbacks[i](allTransl);
    }
  }