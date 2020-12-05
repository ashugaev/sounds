const Router = require('koa-router');
const convert = require('koa-convert');
const KoaBody = require('koa-body');

const { tracksPath, channelImagesPath, channelImagesSetOnePath } = require('./helpers/constants');
const tracks = require('./controllers/tracks');
const tags = require('./controllers/tags');
const categories = require('./controllers/categories');
const channels = require('./controllers/channels');
const channelImages = require('./controllers/channelImages');

const router = new Router();
const koaBody = convert(KoaBody());

router
  .get(tracksPath, tracks.all)
  .get('/api/tags/', tags.all)
  .get('/api/channels/', channels.all)
  .get('/api/categories/', categories.all)
  .get(channelImagesPath, channelImages.all)
  .post(channelImagesSetOnePath, koaBody, channelImages.setOne);

module.exports.routes = () => { return router.routes(); };
module.exports.allowedMethods = () => { return router.allowedMethods(); };
