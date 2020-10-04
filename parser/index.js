const path = require('path');
const parseEnv = require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const log4js = require('log4js');
const { decode } = require('he');
const { get, uniq } = require('lodash');
const axios = require('axios');
const queryString = require('query-string');
const { write: writeJSON } = require('./helpers/json');
const parserData = require('./parser');
const tracks = require('../server/controllers/tracks');
const channelsController = require('../server/controllers/channels');
const db = require('../server/schema/schema');
const { checkEnvs } = require('./helpers/checkEnvs');

let channelsList = [];

const logger = log4js.getLogger();
logger.level = 'debug';

if (parseEnv.error) {
  logger.error('envs parsing error', parseEnv.error);
}

checkEnvs(parseEnv);

const { YOUTUBE_TOKEN } = process.env;

function fetchVideos(channel, nextPageUrl, pageIndex, lastVideoIdOnThisChannel) {
  return new Promise(async (rs, rj) => {
    try {
      const url = getFetchUrl(channel, nextPageUrl);
      let noNewVideosToFetch = false;

      logger.debug('Url', url);

      axios.get(url)
        .then(async (resp) => {
          const {
            data, status, message,
          } = resp;
          const { items, nextPageToken, prevPageToken } = data;

          if (status !== 200 || !items.length) {
            return prevPageToken
              ? rs([])
              : rj('Ошибка получения данных с канала. Url:', url, '. Ошибка', message);
          }

          logger.debug('Got', items.length, 'items');

          let filtered = items.filter(item => item.id.videoId);

          // Индекс видео уже загруженного в базу (если оно есть)
          const lastVideoInDBIndex = filtered.findIndex(el => lastVideoIdOnThisChannel === get(el, 'id.videoId'));

          // Есть есть видео уже существующее в базу
          if (lastVideoInDBIndex >= 0) {
            filtered = filtered.slice(0, lastVideoInDBIndex);

            // Значит в следующих запросох будут только дубли
            noNewVideosToFetch = true;

            logger.debug('Have duplicates from index', lastVideoInDBIndex, '. Items after crop', filtered.length);
          }

          if (filtered.length) {
            decodeData(filtered);
            modifyVideosData(filtered);

            await writeDatoToDB(filtered);
          }

          if (pageIndex === 0) {
            await saveChannelToDB(
              channel,
            );
          }

          rs([nextPageToken, noNewVideosToFetch]);
        });
    } catch (e) {
      rj(e);
    }
  });
}

/**
 * Метод модификации данных видео
 */
function modifyVideosData(list) {
  list.forEach(() => {});
}

function updateFeauteredChannels(list) {
  const { featured, blackList, channelsIds } = parserData;

  const concated = uniq(featured.concat(list));
  const filtered = concated.filter(el => blackList.indexOf(el) === -1 && channelsIds.indexOf(el) === -1);

  parserData.featured = filtered;

  writeNewDataToJson(parserData);
}

/* Это место можено выполнять один раз для всех каналов сразу */
function saveChannelToDB(channelId) {
  return new Promise(async (rs, rj) => {
    try {
      if (!channelId) {
        return rj('Недостаточно данных для сохранения канала. Отсутствует Id.');
      }

      const channelData = await fetchChannelData(channelId);

      const mostPupularVideoFromChannel = await getMostPopularVideoFromChannel(channelId);

      if (mostPupularVideoFromChannel) {
        channelData.bgImage = get(mostPupularVideoFromChannel, 'snippet.thumbnails.medium.url');
      }

      const featuredChannels = get(channelData, 'brandingSettings.channel.featuredChannelsUrls');

      if (featuredChannels && featuredChannels.length) {
        updateFeauteredChannels(featuredChannels);
      }

      await channelsController.insertWithReplace(channelData);

      logger.debug('Channel', get(channelData, 'snippet.title'), 'is saved to DB');

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

function fetchChannelData(id, user, part) {
  return new Promise((rs, rj) => {
    axios.get(getChannelUrl(id, user, part))
      .then((resp) => {
        const { data, status, message } = resp;
        const { items } = data;

        if (status !== 200 || !items.length) {
          return prevPageToken
            ? rs()
            : rj(message);
        }

        logger.debug('Got channel info', id || user);

        rs(items[0]);
      })
      .catch(e => rj(e));
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

async function getVideos(channels, users) {
  const userIds = await getUserIds(users);
  const channelsWithUserIds = uniq(channels.concat(userIds));

  parserData.channelsIds = channelsWithUserIds;
  parserData.userNames = [];

  writeNewDataToJson(parserData);

  return new Promise(async (rs, rj) => {
    try {
      for (let i = 0; i < channelsWithUserIds.length; i++) {
        const channel = channelsWithUserIds[i];

        logger.debug('Get from channel', channel);

        await getVideosFromChannel(channel);
      }

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

function getUserIds(users) {
  return new Promise(async (rs, rj) => {
    try {
      const ids = [];

      for (let i = 0, l = users.length; i < l; i++) {
        const user = users[i];
        const data = await fetchChannelData(undefined, user, 'id');
        const id = get(data, 'id');

        if (id) {
          ids.push(id);
        } else {
          rj('Не получили id для юзера', user);
        }
      }

      rs(ids);
    } catch (e) {
      rj(e);
    }
  });
}

function writeNewDataToJson(data) {
  writeJSON({ data, name: './parser.json' });
}

async function getVideosFromChannel(channel) {
  channelsList = channelsList.concat(await getCnannels());

  const lastVideoIdOnThisChannel = await getLastVideoIdOnThisChannel(channel);

  return new Promise(async (rs, rj) => {
    try {
      for (let nextPageUrl, noNewVideosToFetch, i = 0; !noNewVideosToFetch && (nextPageUrl || i === 0); i++) {
        logger.debug('Page', i, ', nextPageUrl', nextPageUrl);

        [nextPageUrl, noNewVideosToFetch] = await fetchVideos(channel, nextPageUrl, i, lastVideoIdOnThisChannel);
      }

      rs();
    } catch (e) {
      rj(e);
    }
  });
}

function getLastVideoIdOnThisChannel(id) {
  return new Promise(async (rs, rj) => {
    try {
      const data = await db.Tracks.find({ 'snippet.channelId': id }).limit(1).sort({ 'snippet.publishedAt': -1 });

      rs(get(data, '0._doc.id.videoId'));
    } catch (e) {
      rj(e);
    }
  });
}

// FIX: Пока что не получаю статистику по видосам и возвращаю отсюда просто последнее видео
function getMostPopularVideoFromChannel(id) {
  return new Promise(async (rs, rj) => {
    try {
      const data = await db.Tracks.find({ 'snippet.channelId': id }).limit(1).sort({ 'snippet.publishedAt': -1 });

      rs(get(data, '0._doc'));
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

  // TODO: В search ходить дорого по квоте
  return `https://www.googleapis.com/youtube/v3/search?${queryString.stringify(queryParams)}`;
}

function getChannelUrl(id, forUsername, part) {
  const queryParams = {
    part: part || 'snippet,localizations,brandingSettings,statistics,contentDetails',
    key: YOUTUBE_TOKEN,
    // TODO: Заполнить список полей, которые используются
    // fields: 'items(id,snippet(channelId,publishedAt,title,categoryId),statistics)&part=snippet,statistics',
  };

  id && (queryParams.id = id);
  forUsername && (queryParams.forUsername = forUsername);

  return `https://www.googleapis.com/youtube/v3/channels?${queryString.stringify(queryParams)}`;
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
  const { channelsIds, userNames } = parserData;

  try {
    await getVideos(channelsIds, userNames);
  } catch (e) {
    logger.error('Videos fetch error', e);
  } finally {
    process.exit();
  }
})();
