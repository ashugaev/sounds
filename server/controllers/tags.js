const mongoose = require('mongoose');
const db = require('../schema/schema');

module.exports.all = async function (ctx) {
  let ids = ctx.query['ids[]'] || ctx.query.ids;

  if (typeof ids === 'string') ids = [ids];

  const params = ids && { _id: { $in: ids.map(mongoose.mongo.ObjectId) } };

  ctx.body = await db.Tags.find(params).lean();
};
