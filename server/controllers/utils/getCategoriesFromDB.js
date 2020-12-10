const db = require('../../schema/schema');

function getCategoriesFromDB({ categoryName, categoryBlockIds }) {
  return new Promise(async (rs, rj) => {
    try {
      const findParams = {};

      categoryName && (findParams.name = categoryName);
      categoryBlockIds && (findParams.blocks = { $in: categoryBlockIds.split(',') });

      const res = await db.Categories.find(findParams).lean();

      rs(res);
    } catch (e) {
      rj(e);
    }
  });
}

module.exports = {
  getCategoriesFromDB,
};
