const { checkIsAlive } = require('../validators/checkLive');
const { startCronJob } = require('../helpers/startCronJob');
const { tracksIterator } = require('../helpers/tracksIterator');

startCronJob({
  name: 'Check live',
  callback: tracksIterator,
  callbackArgs: [[checkIsAlive], { liveOnly: true }],
  // раз в день в 6 часов
  period: '0 6 * * *',
});
