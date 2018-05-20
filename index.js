require('./config');
const pathParser = require('path').parse;
const asker = require('./src/utils/ask');
const flatTree = require('./src/utils/flatTree');
const fileOrInput = [['Ввести вручную'], ['Файл со словами']];
const ascending = [['По возрастанию'], ['По убыванию']];
const moreOrLess = [['Более чем'], ['Менее чем']]

const mainActions = [
  ['Выбрать текущий словарь'],
  ['Создать словарь'],
  ['Удалить словарь'],
  ['Добавить в словарь', fileOrInput],
  ['Удалить из словаря', fileOrInput],
  ['Упорядочить словарь', [
    ['По алфавиту иностранного слова', ascending],
    ['По алфавиту перевода или кол-ву повторов', ascending]
  ]],
  ['Фильтровать словарь', [
    ['По длине иностранного слова', moreOrLess],
    ['По длине перевода или кол-ву повторов', moreOrLess]
  ]],
  ['Перевести словарь'],
  ['Вывод результата'],
  ['Выход']
];

const requires = (dir, ...paths) => 
  paths.map(file => require(dir + file))

const resolvers = [
  ...requires(
    './src/modules/',
    'selectDictionary',
    'createDictionary',
    'removeDictionary',
    'addWordsToDictionary',
    'removeFromDictionary',
    'sortDictionary',
    'filterDictionary',
    'translateDictionary', 
    'outputDictionary',
  ),
  [() => process.exit()]
];

void async function main() {
  console.log(`Текущий словарь: ${global.dictionaryName}. Выберите команду:\n`);
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