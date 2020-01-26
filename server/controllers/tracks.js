const mongoose = require('mongoose');
const db = require('../schema/schema');

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
  await db.Tracks.collection.insertMany(list);
};
