const mongoose = require('mongoose');
const db = require('../schema/schema');
const log4js = require('../../node_modules/log4js');

const logger = log4js.getLogger();

module.exports.all = async function () {
  let tracksQuantity = 10;

  const { query } = this.request;
  const { page = 0, fromId } = query;

  if (fromId) {
    // Это костыль, который станет не эффективен, когда будет целая куча треков
    tracksQuantity = 0;
  }

  let tags = query['tags[]'] || query.tags;

  if (typeof tags === 'string') tags = [tags];

  const findParams = tags && { tags: { $in: tags.map(mongoose.mongo.ObjectId) } };

  const skips = page * tracksQuantity;

  this.body = await db.Tracks.find(findParams).skip(skips).limit(tracksQuantity);
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
