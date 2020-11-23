const get = require('lodash/get');
const axios = require('axios');
const log4js = require('log4js');
const db = require('../../server/schema/schema');
const { tracksIterator } = require('../helpers/tracksIterator.js');

const logger = log4js.getLogger();
logger.level = 'debug';

/**
 * Проверяет, что трек еще жив
 */
function checkTracksIsNotDead({ track, _id }) {
  return new Promise(async (rs, rj) => {
    const thumbnailUrl = get(track, 'snippet.thumbnails.medium.url');

    try {
      await axios.get(thumbnailUrl);

      logger.debug('Image is Valid', thumbnailUrl);

      rs();
    } catch (e) {
      await db.Tracks.deleteOne({ _id });

      rj(`Dead Track Was Removed :( ${thumbnailUrl}`);
    }
  });
}

(async () => {
  try {
    await tracksIterator([checkTracksIsNotDead]);
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit();
  }
})();
