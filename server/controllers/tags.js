const mongoose = require('mongoose');
const db = require('../schema/schema');

module.exports.all = async function () {
  const { query } = this.request;
  let ids = query['ids[]'] || query.ids;

  if (typeof ids === 'string') ids = [ids];

  const params = ids && { _id: { $in: ids.map(mongoose.mongo.ObjectId) } };

  this.body = await db.Tags.find(params).lean();
};
