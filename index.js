const fs = require('fs');
const https = require('https');
const asker = require('./modules/ask');
const addToCountSet = require('./modules/addToCountSet');
const flatTree = require('./modules/flatTree');

const upDown = [['По возрастанию'], ['По убыванию']];

const mainActions = [
  ['Добавить в набор', [
    ['Ввести вручную'],
    ['Файл со словами']
  ]],
  ['Удалить из набора', [
    ['Найти вручную'],
    ['Файл со словами']
  ]],
  ['Упорядочить набор', [
    ['По алфавиту', upDown],
    ['По количеству повторений', upDown]
  ]],
  ['Перевести частотный набор'],
  ['Вывод результата'],
  ['Выход']
];

const resolvers = [
  addToCountSet,,,,,
  [() => process.exit()]
]

void async function main() {
  console.log('Добро пожаловать. Выберите команду:\n');
  const answer = await asker(mainActions);
  const funcSequence = flatTree(resolvers, answer, 0, 1);

  funcSequence.reduceRight((result, func) => 
    result = result.then(func), Promise.resolve());
  //main();
}();

function delFromCountSet() {
  
}

function writeLocalDict(concTransl) {
  let date = new Date(),
      getDate = date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear();

  fs.writeFileSync(
    `./dictionaries/${getDate}.json`,
    JSON.stringify(concTransl)
  )
}