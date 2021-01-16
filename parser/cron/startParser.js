const { getVideos } = require('../parser');
const { startCronJob } = require('../helpers/startCronJob');

startCronJob({
  name: 'Videos Parser',
  callback: getVideos,
  // раз в день в 0 часов
  period: '0 0 * * *',
});
