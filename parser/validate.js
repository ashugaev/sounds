const get = require('lodash/get');
const axios = require('axios');
const log4js = require('log4js');
const getTracks = require('../server/controllers/utils/getTracksFromDB');
const db = require('../server/schema/schema');

const logger = log4js.getLogger();
logger.level = 'debug';

/**
 * Проверка на дубли и битые треки
 * цикл wile, который работает до тех пор пока приходят треки из базы
 *в каждой итерации
 * - получение n треков начиная с первого или последнего проверенного и запись их
 * - запись иденти
 *
 */

function allTracksIterator(callback) {
  return new Promise(async (rs, rj) => {
    let lastFetchedTracks = [];
    let lastTrackId;

    do {
      try {
        lastFetchedTracks = await getTracks({
          afterObjId: lastTrackId,
          Quantity: 100,
        });
      } catch (e) {
        rj(e);
      }

      const tracksLength = lastFetchedTracks.length;

      if (!tracksLength) return;

      lastTrackId = lastFetchedTracks[tracksLength - 1]._id.toString();

      for (let i = 0; i < tracksLength; i++) {
        const track = lastFetchedTracks[i];

        try {
          await callback(track);
        } catch (e) {
          logger.error(e);
        }
      }
    } while (lastFetchedTracks.length);

    logger.debug('READY!');
  });
}

function validateTrack(track) {
  return new Promise(async (rs, rj) => {
    const thumbnailUrl = get(track, 'snippet.thumbnails.medium.url');

    try {
      await axios.get(thumbnailUrl);

      logger.debug('Image is Valid', thumbnailUrl);

      rs();
    } catch (e) {
      await db.Tracks.deleteOne({ _id: track._id });

      rj(`Dead Track Was Removed :( ${thumbnailUrl}`);
    }
  });
}

(async () => {
  try {
    await allTracksIterator(validateTrack);
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit();
  }
})();
