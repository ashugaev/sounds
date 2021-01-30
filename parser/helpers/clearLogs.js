const fs = require('fs');
const { log } = require('../../common/utils/log');

const logFiles = [
  'checkDeadTracks.logfile',
  'checkLive.logfile',
  'rmLogs.logfile',
  'checkDuplicates.logfile',
  'parser.logfile',
];

/**
 * Переносит накопившиеся логи в папку
 */
module.exports.clearLogs = (folder, postfix) => {
  const date = new Date();
  const dir = `${folder}/${date.getMonth()}_${date.getDay()}_${date.getFullYear()}${postfix ? `_${postfix}` : ''}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    logFiles.forEach((fileName) => {
      const oldPath = `${folder}/${fileName}`;

      if (fs.existsSync(oldPath)) {
        try {
          fs.copyFileSync(oldPath, `${dir}/${fileName}`, fs.constants.COPYFILE_FICLONE);
          log.info(`${fileName} Successfully copied`);

          fs.writeFileSync(oldPath, '');
        } catch (e) {
          log.info(`${fileName} Cant write or copy file `);
        }
      }
    });
  }
};
