const db = require('../schema/schema');

module.exports.all = async function (ctx) {
  try {
    const { query } = ctx.request;
    const { id } = query;

    const result = await db.Tracks.find({ 'snippet.channelId': id })
      .select({ 'snippet.thumbnails.medium.url': 1, _id: 0 })
      .limit(50)
      .lean();

    const images = result.map(el => el.snippet.thumbnails.medium.url);

    ctx.body = images;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.message;
  }
};

module.exports.setOne = async function (ctx) {
  try {
    const { id, wrapImageUrl } = ctx.request.body;

    await db.Channels.update({ id }, { $set: { bgImage: wrapImageUrl } });

    ctx.status = 200;
  } catch (error) {
    console.error(error);

    ctx.status = 500;
    ctx.body = error.message;
  }
};
