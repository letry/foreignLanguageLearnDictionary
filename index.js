const fs = require('fs');
const util = require('util');
const asker = require('./modules/ask');
const flatTree = require('./modules/flatTree');
const addToDictionary = require('./modules/addToDictionary');
const removeFromDictionary = require('./modules/removeFromDictionary');
const selectDictionary = require('./modules/selectDictionary');
const createDictionary = require('./modules/createDictionary');
global.dictionary = `${__dirname}/dictionaries/default.json`;

const upDown = [['По возрастанию'], ['По убыванию']];
const mainActions = [
  ['Выбрать рабочий словарь'],
  ['Создать словарь'],
  ['Добавить в словарь', [
    ['Ввести вручную'],
    ['Файл со словами']
  ]],
  ['Удалить из словаря', [
    ['Ввести вручную'],
    ['Файл со словами']
  ]],
  ['Упорядочить словарь', [
    ['По алфавиту', upDown],
    ['По количеству повторений', upDown]
  ]],
  ['Перевести словарь'],
  ['Вывод результата'],
  ['Выход']
];

const resolvers = [
  selectDictionary,
  createDictionary,
  addToDictionary,
  removeFromDictionary,,,,
  [() => process.exit()]
];

void async function main() {
  console.log('Добро пожаловать. Выберите команду:\n');
  const answer = await asker(mainActions);
  const funcSequence = flatTree(resolvers, answer, 0, 1);

  await funcSequence.reduceRight((result, func) => 
    result = result.then(func), Promise.resolve());
  main();
}();