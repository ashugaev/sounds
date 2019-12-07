const mongoose = require('mongoose');
const db = require('../schema/schema');

module.exports.all = async function () {
  const tracksQuantity = 10;

  const { query } = this.request;
  const { page = 0 } = query;
  let tags = query['tags[]'] || query.tags;

  if (typeof tags === 'string') tags = [tags];

  const findParams = tags && { tags: { $in: tags.map(mongoose.mongo.ObjectId) } };

  const skips = page * tracksQuantity;

  this.body = await db.Tracks.find(findParams).skip(skips).limit(tracksQuantity);
};

module.exports.insertMany = async function (list) {
  await db.Tracks.collection.insertMany(list);
};
