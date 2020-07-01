import React from 'react';
import './TimeLine.sass';
import { observer, inject } from 'mobx-react';
import { cn } from '@bem-react/classname';
import j from 'join';

const cnTimeLine = cn('TimeLine');

const TimeLine = inject('playerStore', 'tracksStore')(observer(({
  className, playerStore, tracksStore,
}) => {
  const { getPercent, setByPercent } = playerStore;
  const { track } = tracksStore;
  const { isLive } = track;

  function onClick(e) {
    if (isLive) return;

    const { offsetX, target } = e.nativeEvent;

    // Не совсем корректно брать из target ширину, потому что может быть клик по вложенному эелментуы и там др ширина
    const newPercent = offsetX / target.offsetWidth * 100;

    setByPercent(newPercent);
  }
  return (
    <div className={j(cnTimeLine({ deactivated: isLive }), className)} onClick={onClick}>
      <div style={{ width: `${isLive ? 100 : getPercent}%` }} className={cnTimeLine('Current')} />
    </div>
  );
}));

export default TimeLine;
