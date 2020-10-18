import React from 'react';
import Text from 'c/Text';
import { observer, inject } from 'mobx-react';
import j from 'join';
import s from './Time.sass';

const Time = inject('playerStore')(observer(({ className, playerStore, live }) => {
  const { currentTimeStr, durationStr } = playerStore;

  function getTime(time) {
    return time || '-';
  }

  return (
    <div className={j(s.TimeLabel, className)}>
      {
        live
          ? <Text className={s.Live} color="white">Live</Text>
          : <Text size="xs" color="white" text={j(getTime(currentTimeStr), '/', getTime(durationStr))} />
      }
    </div>
  );
}));

export default Time;
