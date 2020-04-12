const mongoose = require('mongoose');
const log4js = require('log4js');
const db = require('../schema/schema');

const logger = log4js.getLogger();

module.exports.all = async function () {
  console.time('tracks endpoint');

  const { query } = this.request;
  const {
    fromObjId, channel, afterObjId, beforeObjId, limit,
  } = query;

  const tracksQuantity = Number(limit) || 6;

  let tags = query['tags[]'] || query.tags;

  if (typeof tags === 'string') tags = [tags];

  const findParams = {};
  const sortParams = { _id: 1 };

  tags && (findParams.tags = { $in: tags.map(mongoose.mongo.ObjectId) });
  channel && (findParams['snippet.channelId'] = channel);
  fromObjId && (findParams._id = { $gte: fromObjId });
  afterObjId && (findParams._id = { $gt: afterObjId });
  beforeObjId && (findParams._id = { $lt: beforeObjId }, sortParams._id = -1);

  let tracks = await db.Tracks.find(findParams).limit(tracksQuantity).sort(sortParams);

  // Нужно реверcнуть, потому что в этом случае у базы была обратная сортировка
  if (beforeObjId) {
    tracks = tracks.reverse();
  }

  console.timeEnd('tracks endpoint');

  this.body = tracks;
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
