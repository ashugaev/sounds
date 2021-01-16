const { clearLogs } = require('../helpers/clearLogs');
const { startCronJob } = require('../helpers/startCronJob');

startCronJob({
  name: 'clear logs',
  callback: clearLogs,
  // каждый первый день недели в 0 часов
  period: '0 0 * * 1',
});
