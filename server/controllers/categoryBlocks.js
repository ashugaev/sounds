const { getCategoryBlocksFromDB } = require('./utils/getCategoryBlocksFromDB');

module.exports.all = async function (ctx) {
  try {
    const data = await getCategoryBlocksFromDB();

    ctx.body = data;
  } catch (e) {
    ctx.status = 500;
    ctx.body = e.message;
  }
};
