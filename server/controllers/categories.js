const db = require('../schema/schema');

module.exports.all = async function () {
  const { query } = this.request;
  const {
    categoryName,
  } = query;

  const findParams = {};

  categoryName && (findParams.path = categoryName);

  this.body = await db.Categories.find(findParams);
};
