const get = require('lodash/get');
const axios = require('axios');
const log4js = require('log4js');
const getTracks = require('../server/controllers/utils/getTracksFromDB');
const db = require('../server/schema/schema');

const logger = log4js.getLogger();
logger.level = 'debug';

/**
 * Просто проходится по всем трекам из базы
 * */
function allTracksIterator(...callbackList) {
  return new Promise(async (rs, rj) => {
    let lastFetchedTracks = [];
    let lastTrackId;
    let counter = 0;

    do {
      try {
        lastFetchedTracks = await getTracks({
          afterObjId: lastTrackId,
          tracksQuantity: 30,
        });
      } catch (e) {
        rj(e);
      }

      const tracksLength = lastFetchedTracks.length;

      if (!tracksLength) return;

      lastTrackId = lastFetchedTracks[tracksLength - 1]._id.toString();

      for (let i = 0; i < tracksLength; i++) {
        const track = lastFetchedTracks[i];

        logger.info(`Track number ${counter}`);
        counter++;

        for (let j = 0; j < callbackList.length; j++) {
          try {
            await callbackList[j](track);
          } catch (e) {
            logger.error(e);
          }
        }
      }
    } while (lastFetchedTracks.length);

    logger.debug('READY!');
  });
}

/**
 * Проверяет, что трек еще жив
 */
function checkTracksIsNotDead(track) {
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

/**
 * Проверяет, что у трека не появились дубли
 */
function checkDuplicates(track) {
  return new Promise(async (rs) => {
    const pathToId = 'id.videoId';
    track = JSON.parse(JSON.stringify(track));
    const id = get(track, pathToId);

    logger.debug('Check duplicate', id);

    const duplicates = await db.Tracks.find({ [pathToId]: id });

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
  });
}

(async () => {
  try {
    await allTracksIterator(checkTracksIsNotDead, checkDuplicates);
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit();
  }
})();
