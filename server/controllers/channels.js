const log4js = require('log4js');
const db = require('../schema/schema');

const logger = log4js.getLogger();

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

// Метод поочередно вставляет с заменой, либо создает новые документы
// В айтемах должно быть поле id для поиска по базе
module.exports.insertWithReplace = async function (items) {
  const ItemsInArray = [].concat(items);

  for (let i = 0, l = ItemsInArray.length; i < l; i++) {
    try {
      await replaceOne(ItemsInArray[i]);
    } catch (e) {
      logger.error(e);
    }
  }
};

function replaceOne(item) {
  return new Promise(async (rs, rj) => {
    try {
      await db.Channels.collection.replaceOne(
        { id: item.id },
        item,
        { upsert: true },
      );

      rs();
    } catch (e) {
      rj(e);
    }
  });
}
