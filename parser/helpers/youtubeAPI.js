const queryString = require('query-string');
const path = require('path');

const youtubeAPIpath = {
  videosList: 'https://youtube.googleapis.com/youtube/v3/videos',
};

const parseEnv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (parseEnv.error) {
  logger.error('envs parsing error', parseEnv.error);
}

const { YOUTUBE_TOKEN } = process.env;

function videosList({
  ids,
  fields,
}) {
  const queryParams = {
    id: Array.isArray(ids) ? ids.join(',') : ids,
    key: YOUTUBE_TOKEN,
    part: 'snippet',
    order: 'date',
    maxResults: 50,
    fields,
  };

  return `${youtubeAPIpath.videosList}?${queryString.stringify(queryParams)}`;
}

const getYoutubeApiUrl = {
  videosList,
};

module.exports = { getYoutubeApiUrl };
