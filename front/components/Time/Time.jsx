import React from 'react';
import './Time.sass';
import { observer, inject } from 'mobx-react';

const Time = inject('playerStore')(observer(({ className, playerStore, live }) => {
  const { currentTimeStr, durationStr } = playerStore;

  function getTime(time) {
    return time || '-';
  }

  return (
    <div className={`TimeLabel ${className || ''}`}>
      {live ? <div className="TimeLabel-Live">Live</div> : `${getTime(currentTimeStr)} | ${getTime(durationStr)}`}
    </div>
  );
}));

export default Time;
