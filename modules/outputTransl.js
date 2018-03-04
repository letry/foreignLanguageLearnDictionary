module.exports = function outFreqTrans() {
    let freqTrans = require('./dictionaries/allTranslWords'),
        resp = outputTransl(freqTrans);
    console.log('Записано ' + resp + ' блоков');
    ask();
  }
  
  function outputTransl(concTransl) {
    let templ = fs.readFileSync('./outputText/doc.html') + '',
        tblPos = templ.indexOf('<table>') + 7,
        tblendOPos = templ.indexOf('</table>'),
        beforeTbl = templ.slice(0, tblPos),
        afterTbl = templ.slice(tblendOPos);
    
    let tbodys = [],
        trs = '',
        i = 0;
    
    for (let word in concTransl) {
      trs += `<tr><td>${word + ' - ' + concTransl[word]}</td></tr>`;
      ++i;
      if (i === 10) {
        tbodys.push(trs);
        trs = '';
        i = 0;
      }
    }
    
    tbodys = '<tbody>' + tbodys.join('</tbody><tbody>') + '</tbody>';
    
    fs.writeFileSync('./outputText/doc.html', beforeTbl + tbodys + afterTbl);
    
    return tbodys.length;
  }