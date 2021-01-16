const { checkTracksIsNotDead } = require('../validators/checkDeadTracks');
const { startCronJob } = require('../helpers/startCronJob');
const { tracksIterator } = require('../helpers/tracksIterator.js');

startCronJob({
  name: 'Check dead track',
  callback: tracksIterator,
  callbackArgs: [[checkTracksIsNotDead]],
  // раз в два дня в 18 часов
  period: '0 18 */2 * *',
});
