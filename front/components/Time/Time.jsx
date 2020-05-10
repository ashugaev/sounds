import React from 'react';
import './Time.sass';
import Text from 'c/Text';
import { observer, inject } from 'mobx-react';
import j from 'join';

const Time = inject('playerStore')(observer(({ className, playerStore, live }) => {
  const { currentTimeStr, durationStr } = playerStore;

  function getTime(time) {
    return time || '-';
  }

  return (
    <div className={`TimeLabel ${className || ''}`}>
      {
        live
          ? <Text className="TimeLabel-Live" color="white">Live</Text>
          : <Text size="xs" color="white" text={j(getTime(currentTimeStr), '/', getTime(durationStr))} />
      }
    </div>
  );
}));

export default Time;
