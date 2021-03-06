const log4js = require('log4js');
const db = require('../schema/schema');
const getTracks = require('./utils/getTracksFromDB');

const logger = log4js.getLogger();

module.exports.all = async function (ctx) {
  const {
    fromObjId, channel, afterObjId, beforeObjId, limit, liveOnly, searchStr, category,
  } = ctx.query;

  const tracksQuantity = Number(limit) || 6;

  let tags = ctx.query['tags[]'] || ctx.query.tags;

  if (typeof tags === 'string') tags = [tags];

  try {
    let tracks = await getTracks({
      fromObjId, channel, afterObjId, beforeObjId, limit, liveOnly, tracksQuantity, tags, searchStr, category,
    });

    // Нужно реверcнуть, потому что в этом случае у базы была обратная сортировка
    if (beforeObjId) {
      tracks = tracks.reverse();
    }

    ctx.body = tracks;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.message;
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
