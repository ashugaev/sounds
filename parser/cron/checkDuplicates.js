const { checkDuplicates } = require('../validators/checkDuplicates');
const { startCronJob } = require('../helpers/startCronJob');
const { tracksIterator } = require('../helpers/tracksIterator.js');

startCronJob({
  name: 'Check duplicates',
  callback: tracksIterator,
  callbackArgs: [[checkDuplicates]],
  // раз в неделю в 12 часов
  period: '0 12 * * 1',
});
