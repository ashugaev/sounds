const log4js = require('log4js');

const logger = log4js.getLogger();

/**
 * Проверит, что все переменные окружения из .env заполнены
 */
function checkEnvs({ parsed }) {
  const keys = Object.keys(parsed);

  const allEnvsFilled = keys.every(key => parsed[key] && parsed[key].length);

  if (!allEnvsFilled) {
    logger.error('Fill environment variables');
  }

  return allEnvsFilled;
}

module.exports = {
  checkEnvs,
};
