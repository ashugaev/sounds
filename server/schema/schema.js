const mongoose = require('mongoose');
const path = require('path');
const { checkEnvs } = require('../helpers/checkEnvs');

const parseEnv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (parseEnv.error) {
  console.log('envs parsing error', parseEnv.error);
}

checkEnvs(parseEnv);

const { MONGO_USER_NAME, MONGO_USER_PASSWORD, MONGO_HOST } = process.env;

mongoose.connect(`mongodb+srv://${MONGO_USER_NAME}:${MONGO_USER_PASSWORD}@${MONGO_HOST}?retryWrites=true`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const { Schema } = mongoose;

const Tracks = new Schema({
  snippet: {
    channelTitle: String,
    description: String,
    title: String,
    thumbnails: {
      medium: {
        url: String,
      },
    },
  },
});

// Индексация для нативного поиска по тексту в Mongo DB
Tracks.index({
  'snippet.channelTitle': 1,
  'snippet.description': 1,
  'snippet.title': 1,
}, {
  weights: {
    'snippet.title': 10,
    'snippet.channelTitle': 3,
    'snippet.description': 1,
  },
});

const Tags = new Schema({});

const Cagetories = new Schema({
  name: String,
});

const Channels = new Schema({
  channelId: String,
  channelTitle: String,
});

module.exports = {
  Tracks: mongoose.model('Tracks', Tracks),
  Tags: mongoose.model('Tags', Tags),
  Channels: mongoose.model('Channels', Channels),
  Categories: mongoose.model('Categories', Cagetories),
};
