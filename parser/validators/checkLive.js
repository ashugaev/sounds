/**
 * TODO: Сейчас не обрабатывается кейс с трансляциями, который перевели в обычный видос (их меньше 10%)
 */

const axios = require('axios');
const log4js = require('log4js');
const get = require('lodash/get');
const { getYoutubeApiUrl } = require('../helpers/youtubeAPI');
const db = require('../../server/schema/schema');

const logger = log4js.getLogger();
logger.level = 'debug';

/**
 * Проверяет жива ли трансляция
 */
module.exports.checkIsAlive = ({ videoId, _id }) => {
  return new Promise((rs, rj) => {
    const getUrl = getYoutubeApiUrl.videosList({
      ids: videoId,
      fields: 'items(snippet/liveBroadcastContent)',
    });

    axios.get(getUrl)
      .then(async (resp) => {
        const {
          data, status,
        } = resp;
        const { items } = data;

        if (status !== 200 || !items || !items.length) {
          rj('Проблемы с получением трека');
          return;
        }

        if (get(items, '0.snippet.liveBroadcastContent') !== 'live') {
          logger.debug('Удаляем нахер', videoId);

          try {
            await db.Tracks.deleteOne({ _id });
          } catch (e) {
            rs(e);
          }
        }

        rs();
      })
      .catch(e => rj(e));
  });
};

/*
(async () => {
  try {
    await tracksIterator([checkIsAlive], { liveOnly: true });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit();
  }
})();
 */
