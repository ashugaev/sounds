const db = require('../../schema/schema');

function getChannelsFromDB({
  channelId,
}) {
  return new Promise(async (rs, rj) => {
    try {
      const findParams = {};

      channelId && (findParams.id = channelId);

      const res = await db.Channels.find(findParams).lean();

      rs(res);
    } catch (e) {
      rj(e);
    }
  });
}

module.exports = {
  getChannelsFromDB,
};
