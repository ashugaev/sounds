const { CronJob } = require('cron');
const { log } = require('../../common/utils/log');

module.exports.startCronJob = ({
  name,
  period,
  callback,
  callbackArgs,
}) => {
  const job = new CronJob(
    period,
    async () => {
      console.log('Start:', name);

      try {
        callbackArgs
          ? await callback(...callbackArgs)
          : await callback();
      } catch (e) {
        log.error('Videos fetch error', e);
      }
    },
    () => {
      console.log('Complete:', name);
    },
    false,
    'Europe/Moscow',
  );

  job.start();

  return job;
};
