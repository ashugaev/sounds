// Мидлвара для проксирования /api запросов на dev

const Bundler = require('parcel-bundler');
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use('/api', proxy({ target: 'http://localhost:3000', changeOrigin: true }));

const bundler = new Bundler('components/index.html');
app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));

