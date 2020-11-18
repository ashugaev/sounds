const log4js = require('log4js');
const getTracks = require('../../server/controllers/utils/getTracksFromDB');
const get = require('lodash/get');

const logger = log4js.getLogger();
logger.level = 'debug';

/**
 * Просто проходится по трекам из базы
 * */

const tracksIterator = (callbackList, filters = {}) => {
  return new Promise(async (rs, rj) => {
    let lastFetchedTracks = [];
    let lastTrackId;
    let counter = 0;

    do {
      try {
        lastFetchedTracks = await getTracks({
          afterObjId: lastTrackId,
          tracksQuantity: 30,
          liveOnly: filters.liveOnly,
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
            trackJSON = JSON.parse(JSON.stringify(track));

            const videoId = get(trackJSON, 'id.videoId');
            const { _id } = track;

            await callbackList[j]({
              track,
              videoId,
              _id,
            });
          } catch (e) {
            logger.error(e);
          }
        }
      }
    } while (lastFetchedTracks.length);

    logger.debug('READY!');

    rs();
  });
};

module.exports = {
  tracksIterator,
};
