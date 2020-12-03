const db = require('../schema/schema');

module.exports.all = async function () {
  try {
    const { query } = this.request;
    const { id } = query;

    const result = await db.Tracks.find({ 'snippet.channelId': id })
      .select({ 'snippet.thumbnails.medium.url': 1, _id: 0 })
      .limit(50)
      .lean();

    const images = result.map(el => el.snippet.thumbnails.medium.url);

    console.log('images', id, images);

    this.body = images;
  } catch (error) {
    this.status = 500;
    this.body = error.message;
  }
};
