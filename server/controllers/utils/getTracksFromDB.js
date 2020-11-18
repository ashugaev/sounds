const mongoose = require('mongoose');
const db = require('../../schema/schema');

/**
 * Достает треки из базы по указанным параметрам
 */

function getTracks({
  fromObjId, channel, afterObjId, beforeObjId, liveOnly, tracksQuantity, tags, searchStr,
}) {
  return new Promise(async (rs, rj) => {
    try {
      const findParams = {};
      let findProjection = {};
      let sortParams = { 'snippet.liveBroadcastContent': 1, _id: 1 };

      (liveOnly === 'true' || liveOnly === true) && (findParams['snippet.liveBroadcastContent'] = 'live');
      tags && (findParams.tags = { $in: tags.map(mongoose.mongo.ObjectId) });
      channel && (findParams['snippet.channelId'] = { $in: channel.split(',') });
      fromObjId && (findParams._id = { $gte: fromObjId });
      afterObjId && (findParams._id = { $gt: afterObjId });
      beforeObjId && (findParams._id = { $lt: beforeObjId }, sortParams._id = -1);
      searchStr && (
        findParams.$text = {
          $search: searchStr,
          $language: 'en',
        },
        sortParams = { score: { $meta: 'textScore' } },
        findProjection = sortParams
      );

      // FIXME: Из базы приходит нестабильная сортировка и поэтому плеер расходится со страницей, если сортаировать не по _id
      // Если нет тега или канала, то сортаровать по времени добавления на ютуб
      // if ((!tags || !tags.length) && !channel) {
      //   sortParams = beforeObjId ? { 'snippet.publishedAt': 1 } : { 'snippet.publishedAt': -1 };
      // }

      const tracks = await db.Tracks.find(findParams, findProjection).limit(tracksQuantity).sort(sortParams);

      rs(tracks);
    } catch (e) {
      rj(e);
    }
  });
}

module.exports = getTracks;
