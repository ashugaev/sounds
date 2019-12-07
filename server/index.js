const Koa = require('koa')
var compress = require('koa-compress')
var logger = require('koa-logger')
var route = require('koa-route')
var tracks = require('./controllers/tracks')
var tags = require('./controllers/tags')

const app = new Koa()

// Logger
app.use(logger())

app.use(route.get('/api/tracks/', tracks.all))
app.use(route.get('/api/tags/', tags.all))

// Compress
app.use(compress())

const port = 3000

app.listen(port)

console.log(`listening on port ${port}`)
