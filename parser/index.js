const path = require('path');
const parseEnv = require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const log4js = require('log4js');
const { decode } = require('he');
const { get } = require('lodash');
const queryString = require('../front/node_modules/query-string');
const { channelsIds } = require('./parser');
const axios = require('../front/node_modules/axios');
const tracks = require('../server/controllers/tracks');
const channelsController = require('../server/controllers/channels');
const db = require('../server/schema/schema');

let channelsList = [];

const logger = log4js.getLogger();
logger.level = 'debug';

if (parseEnv.error) {
  logger.error('envs parsing error', parseEnv.error);
}

const { YOUTUBE_TOKEN } = process.env;

function fetchVideos(channel, nextPageUrl, pageIndex) {
  return new Promise(async (rs, rj) => {
    try {
      const url = getFetchUrl(channel, nextPageUrl);

      logger.debug('Url', url);

      axios.get(url)
        .then(async (resp) => {
          const { data, status } = resp;
          const { items, nextPageToken, prevPageToken } = data;

          if (status !== 200 || !items.length) {
            return prevPageToken
              ? rs()
              : rj('Ошибка получения данных с канала. Url:', url);
          }

          logger.debug('Got', items.length, 'items');

          const filtered = items.filter(item => item.id.videoId);

          decodeData(filtered);

          const channelId = get(filtered, '0.snippet.channelId');

          if (pageIndex === 0 && !channelsList.some(el => el.channelId === channelId)) {
            await saveChannelToDB(
              channelId,
              get(filtered, '0.snippet.channelTitle'),
            );
          }

          await writeDatoToDB(filtered);

          rs(nextPageToken);
        });
    } catch (e) {
      rj(e);
    }
  });
}


function saveChannelToDB(channelId, channelTitle) {
  return new Promise(async (rs, rj) => {
    try {
      if (!channelId || !channelTitle) {
        return rj('Недостаточно данных для сохранения канала.', 'Id:', id, 'Title:', title);
      }

      await channelsController.insert({ channelId, channelTitle });

      logger.debug('Channel', channelTitle, 'is saved to DB');

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

function getCnannels() {
  return new Promise(async (rs, rj) => {
    try {
      const data = await db.Channels.find();

      rs(data);
    } catch (e) {
      rj(e);
    }
  });
}

function getVideos(channels) {
  return new Promise(async (rs, rj) => {
    try {
      for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];

        logger.debug('Get from channel', channel);

        await getVideosFromChannel(channel);
      }

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

async function getVideosFromChannel(channel) {
  channelsList = channelsList.concat(await getCnannels());

  return new Promise(async (rs, rj) => {
    try {
      for (let nextPageUrl, i = 0; nextPageUrl || i === 0; i++) {
        logger.debug('Page', i, ', nextPageUrl', nextPageUrl);

        nextPageUrl = await fetchVideos(channel, nextPageUrl, i);
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
    await getVideos(channelsIds);
  } catch (e) {
    logger.error('Videos fetch error', e);
  } finally {
    process.exit();
  }
})();
