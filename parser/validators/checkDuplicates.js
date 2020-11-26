const log4js = require('log4js');
const db = require('../../server/schema/schema');
const { tracksIterator } = require('../helpers/tracksIterator.js');

const logger = log4js.getLogger();
logger.level = 'debug';

/**
 * Проверяет, что у трека не появились дубли
 */
function checkDuplicates({ videoId }) {
  return new Promise(async (rs, rj) => {
    try {
      logger.debug('Check duplicate', videoId);

      const duplicates = await db.Tracks.find({ 'id.videoId': videoId }).lean();

      if (duplicates.length > 1) {
        // Сортировка по live, потому что бывают live и мертвые треки с одним id
        const tracksToKill = duplicates.sort(a => (a.snippet.liveBroadcastContent === 'live' ? -1 : 1)).slice(1);

        for (let i = 0; i < tracksToKill.length; i++) {
          const { _id } = tracksToKill[i];

          await db.Tracks.deleteOne({ _id });

          logger.warn('REMOVED', _id);
        }
      }

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

(async () => {
  try {
    await tracksIterator([checkDuplicates]);
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit();
  }
})();
