const { getCategoriesFromDB } = require('./utils/getCategoriesFromDB');

module.exports.all = async function (ctx) {
  const {
    categoryName,
  } = ctx.query;

  try {
    const categories = await getCategoriesFromDB({ categoryName });
    ctx.body = categories;
  } catch (e) {
    ctx.status = 500;
    ctx.body = e.message;
  }
};
