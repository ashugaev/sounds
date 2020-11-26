const log4js = require('log4js');
const tracks = require('../server/controllers/tracks');
const db = require('../server/schema/schema');

const logger = log4js.getLogger();
logger.level = 'debug';

async function modify(callback) {
  const allTracksList = await db.Tracks.find().lean();

  logger.debug('Got tracks', allTracksList.length);

  for (let i = 0, l = allTracksList.length; i < l; i++) {
    const item = allTracksList[i];

    callback(item);
  }

  await tracks.update({ list: allTracksList });

  logger.debug('Tracks is updated');
}

/**
 * Метод запуска
 */
(async () => {
  try {
    await modify(changeLogic);
  } catch (e) {
    logger.error('Modify error', e);
  } finally {
    process.exit();
  }
})();

/**
 * Метод, который будет применяться к каждому элементу
 */
function changeLogic(data) {
  data.timestamp = new Date(data.snippet.publishedAt).getTime();
}
