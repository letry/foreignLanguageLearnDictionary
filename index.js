const asker = require('./modules/ask');
const flatTree = require('./modules/flatTree');

const addToDictionary = require('./modules/addToDictionary');
const translateDictionary = require('./modules/translateDictionary');
const removeFromDictionary = require('./modules/removeFromDictionary');
const selectDictionary = require('./modules/selectDictionary');
const createDictionary = require('./modules/createDictionary');
const outputDictionary = require('./modules/outputDictionary');
const sortDictionary = require('./modules/sortDictionary');

global.dictionary = `${__dirname}/dictionaries/default.json`;

const fileOrInput = [['Ввести вручную'], ['Файл со словами']];
const ascending = [['По возрастанию'], ['По убыванию']];

const mainActions = [
  ['Выбрать рабочий словарь'],
  ['Создать словарь'],
  ['Добавить в словарь', fileOrInput],
  ['Удалить из словаря', fileOrInput],
  ['Упорядочить словарь', [
    ['По ключу', ascending],
    ['По значению', ascending]
  ]],
  ['Перевести словарь'],
  ['Вывод результата'],
  ['Выход']
];

const resolvers = [
  selectDictionary,
  createDictionary,
  addToDictionary,
  removeFromDictionary,
  sortDictionary,
  translateDictionary,
  outputDictionary,
  [() => process.exit()]
];

void async function main() {
  console.log('Добро пожаловать. Выберите команду:\n');
  const answer = await asker(mainActions);
  const funcSequence = flatTree(resolvers, answer, 0, 1);

  try {
    await funcSequence.reduceRight((result, func) => 
      result = result.then(func), Promise.resolve());
  } catch (error) {
    console.error(error);
  }

  main();
}();