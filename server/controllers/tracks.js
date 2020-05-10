const mongoose = require('mongoose');
const log4js = require('log4js');
const db = require('../schema/schema');

const logger = log4js.getLogger();

// FIXME: Обособить логику получения данных от работы с методами Koa (сделать отдельную ф-цию возврата данных)
module.exports.all = async function () {
  const { query } = this.request;
  const {
    fromObjId, channel, afterObjId, beforeObjId, limit, liveOnly,
  } = query;

  const tracksQuantity = Number(limit) || 6;

  let tags = query['tags[]'] || query.tags;

  if (typeof tags === 'string') tags = [tags];

  const findParams = {};
  let sortParams = { 'snippet.liveBroadcastContent': 1, _id: 1 };

  liveOnly && (findParams['snippet.liveBroadcastContent'] = 'live');
  tags && (findParams.tags = { $in: tags.map(mongoose.mongo.ObjectId) });
  channel && (findParams['snippet.channelId'] = channel);
  fromObjId && (findParams._id = { $gte: fromObjId });
  afterObjId && (findParams._id = { $gt: afterObjId });
  beforeObjId && (findParams._id = { $lt: beforeObjId }, sortParams._id = -1);

  // FIXME: Из базы приходит нестабильная сортировка и поэтому плеер расходится со страницей, если сортаировать не по _id
  // Если нет тега или канала, то сортаровать по времени добавления на ютуб
  if ((!tags || !tags.length) && !channel) {
    sortParams = beforeObjId ? { 'snippet.publishedAt': 1 } : { 'snippet.publishedAt': -1 };
  }

  try {
    let tracks = await db.Tracks.find(findParams).limit(tracksQuantity).sort(sortParams);

    // Нужно реверcнуть, потому что в этом случае у базы была обратная сортировка
    if (beforeObjId) {
      tracks = tracks.reverse();
    }

    this.body = tracks;
  } catch (error) {
    this.status = 500;
    this.body = error.message;
  }
};

module.exports.insertMany = async function (list) {
  return new Promise(async (rs, rj) => {
    try {
      await db.Tracks.collection.insertMany(list);

      rs();
    } catch (e) {
      rj(e);
    }
  });
};

// TODO: Продебажить. Кажется этот методе не работает
module.exports.insertManyWithReplace = function (items) {
  return new Promise(async (rs, rj) => {
    try {
      // TODO: Сделать через db.Tracks.collection.bulkWrite(ops, { ordered: false });
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        await db.Tracks.collection.replaceOne(
          { id: { videoId: item.id.videoId } },
          { $set: item },
          { upsert: true, multy: true },
          () => {
            logger.debug('Трек', item.id.videoId, 'c канала', item.snippet.channelTitle, 'сохранен');
          },
        );
      }

      rs();
    } catch (e) {
      rj(e);
    }
  });
};

// FIXME: Пока что не работает из-за неправильных параметров updateMany и updateOne
module.exports.update = function ({ list, upsert }) {
  return new Promise(async (rs, rj) => {
    try {
      const params = {};

      upsert && (params.upsert = upsert);

      list.length
        ? await db.Channels.collection.updateMany({}, { $set: list }, params)
        : await db.Channels.collection.updateOne(list, params);

      rs();
    } catch (e) {
      rj(e);
    }
  });
};
