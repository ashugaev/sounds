const path = require('path');
const parseEnv = require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const log4js = require('log4js');
const { decode } = require('he');
const queryString = require('../front/node_modules/query-string');
const { channels } = require('./parser');
const axios = require('../front/node_modules/axios');
const tracks = require('../server/controllers/tracks');

const logger = log4js.getLogger();
logger.level = 'debug';

if (parseEnv.error) {
  logger.error('envs parsing error', parseEnv.error);
}

const { YOUTUBE_TOKEN } = process.env;

function fetchVideos(channel, nextPageUrl) {
  return new Promise(async (rs, rj) => {
    try {
      const url = getFetchUrl(channel, nextPageUrl);

      logger.debug('Url', url);

      axios.get(url)
        .then(async (resp) => {
          const { data, status } = resp;
          const { items, nextPageToken } = data;

          if (status !== 200 || !items.length) {
            return rj('Ошибка получения данных с канала. Url:', url);
          }

          logger.debug('Got', items.length, 'items');

          const filtered = items.filter(item => item.id.videoId);

          decodeData(filtered);

          await writeDatoToDB(filtered);

          rs(nextPageToken);
        });
    } catch (e) {
      rj(e);
    }
  });
}

function getVideos(items) {
  return new Promise(async (rs, rj) => {
    try {
      for (let i = 0; i < items.length; i++) {
        const channel = items[i];

        logger.debug('Get from channel', channel);

        await getVideosFromChannel(channel);
      }

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

function getVideosFromChannel(channel) {
  return new Promise(async (rs, rj) => {
    try {
      for (let nextPageUrl, i = 0; nextPageUrl || i === 0; i++) {
        logger.debug('Page', i, ', nextPageUrl', nextPageUrl);

        nextPageUrl = await fetchVideos(channel, nextPageUrl);
      }

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

function getFetchUrl(channel, nextPageUrl) {
  const queryParams = {
    key: YOUTUBE_TOKEN,
    channelId: channel,
    part: 'snippet,id',
    order: 'date',
    maxResults: 50,
  };

  nextPageUrl && (queryParams.pageToken = nextPageUrl);

  return `https://www.googleapis.com/youtube/v3/search?${queryString.stringify(queryParams)}`;
}

function writeDatoToDB(videos) {
  return new Promise(async (rs, rj) => {
    try {
      await tracks.insertMany(videos);

      logger.debug('Writed', videos.length, 'videos to db');

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

const fieldsToEncode = [
  'description',
  'channelTitle',
  'title',
];

function decodeData(videos) {
  videos.forEach((video) => {
    const { snippet } = video;

    snippet && fieldsToEncode.forEach((field) => {
      snippet[field] && (snippet[field] = decode(snippet[field]));
    });
  });
}

/**
 * Метод запуска сбора видео
 */
(async () => {
  try {
    await getVideos(channels);
  } catch (e) {
    logger.error('Videos fetch error', e);
  } finally {
    process.exit();
  }
})();
