const db = require('../../schema/schema');

function getCategoryBlocksFromDB() {
  return new Promise(async (rs, rj) => {
    try {
      const res = await db.CategoryBlocks.find({}).lean();

      rs(res);
    } catch (e) {
      rj(e);
    }
  });
}

module.exports = {
  getCategoryBlocksFromDB,
};
