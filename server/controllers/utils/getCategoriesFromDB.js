const db = require('../../schema/schema');

function getCategoriesFromDB({ categoryName }) {
  return new Promise(async (rs, rj) => {
    try {
      const findParams = {};

      categoryName && (findParams.path = categoryName);

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
