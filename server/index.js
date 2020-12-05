const Koa = require('koa');
const compress = require('koa-compress');
const logger = require('koa-logger');
const err = require('./middleware/error');
const { routes, allowedMethods } = require('./routes');

const app = new Koa();

app.use(logger());
app.use(err);
app.use(routes());
app.use(allowedMethods());
app.use(compress());

const port = 3000;

app.listen(port);

console.log(`listening on port ${port}`);
