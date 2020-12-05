const { log } = require('./log');

const wait = (minTime, maxTime) => new Promise((rs) => {
  if (maxTime) {
    minTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
  }

  log.debug('wait', minTime, 'milliseconds');

  setTimeout(rs, minTime);
});

module.exports = { wait };
