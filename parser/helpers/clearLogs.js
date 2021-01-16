const fs = require('fs');
const { log } = require('../../common/utils/log');

const logFiles = [
  'checkDeadTracks.logfile',
  'checkLive.logfile',
  'rmLogs.logfile',
  'checkDuplicates.logfile',
  'parser.logfile',
];

module.exports.clearLogs = () => {
  const date = new Date();
  const dir = `./logs/${date.getMonth()}_${date.getDay()}_${date.getYear()}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    logFiles.forEach((fileName) => {
      fs.rename(`./logs/${fileName}`, `${dir}/${fileName}`, (err) => {
        if (err) throw err;
        log.info(`${fileName} Successfully moved`);
      });
    });
  }
};
