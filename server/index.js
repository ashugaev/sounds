const Koa = require('koa');
const compress = require('koa-compress');
const logger = require('koa-logger');
const route = require('koa-route');
const { tracksPath } = require('./helpers/constants');
const tracks = require('./controllers/tracks');
const tags = require('./controllers/tags');
const categories = require('./controllers/categories');
const channels = require('./controllers/channels');

const app = new Koa();

// Logger
app.use(logger());

app.use(route.get(tracksPath, tracks.all));
app.use(route.get('/api/tags/', tags.all));
app.use(route.get('/api/channels/', channels.all));
app.use(route.get('/api/categories/', categories.all));

// Compress
app.use(compress());

const port = 3000;

app.listen(port);

console.log(`listening on port ${port}`);
