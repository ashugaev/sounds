const { getCategoriesFromDB } = require('./utils/getCategoriesFromDB');

module.exports.all = async function () {
  const { query } = this.request;
  const {
    categoryName,
  } = query;

  try {
    const categories = await getCategoriesFromDB({ categoryName });
    this.body = categories;
  } catch (e) {
    this.status = 500;
    this.body = e.message;
  }
};
