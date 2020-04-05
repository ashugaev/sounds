const mongoose = require('mongoose');
const db = require('../schema/schema');

module.exports.all = async function () {
  this.body = await db.Channels.find();
};

module.exports.insert = async function (list) {
  return new Promise(async (rs, rj) => {
    try {
      list.length
        ? await db.Channels.collection.insertMany(list)
        : await db.Channels.collection.insertOne(list);

      rs();
    } catch (e) {
      rj(e);
    }
  });
};

// TODO: Разобаться почему не работает
module.exports.insertWithReplaceOne = async function (item) {
  return new Promise(async (rs, rj) => {
    try {
      await db.Channels.replaceOne(
        { id: item.id },
        item,
        { upsert: true },
      );

      rs();
    } catch (e) {
      rj(e);
    }
  });
};
