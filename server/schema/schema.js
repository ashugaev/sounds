const mongoose = require('mongoose');
const path = require('path');

const parseEnv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (parseEnv.error) {
  console.log('envs parsing error', parseEnv.error);
}

const { MONGO_USER_NAME, MONGO_USER_PASSWORD, MONGO_HOST } = process.env;

mongoose.connect(`mongodb+srv://${MONGO_USER_NAME}:${MONGO_USER_PASSWORD}@${MONGO_HOST}?retryWrites=true`);

const { Schema } = mongoose;

const Tracks = new Schema({});

const Tags = new Schema({});

const Channels = new Schema({
  channelId: String,
  channelTitle: String,
});

module.exports = {
  Tracks: mongoose.model('Tracks', Tracks),
  Tags: mongoose.model('Tags', Tags),
  Channels: mongoose.model('Channels', Channels),
};
