const { getCategoriesFromDB } = require('./utils/getCategoriesFromDB');

module.exports.all = async function (ctx) {
  const {
    categoryName,
    categoryBlockIds,
  } = ctx.query;

  try {
    const categories = await getCategoriesFromDB({ categoryName, categoryBlockIds });
    ctx.body = categories;
  } catch (e) {
    ctx.status = 500;
    ctx.body = e.message;
  }
};
