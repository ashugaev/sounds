import React from 'react';
import './TimeLine.sass';
import { observer, inject } from 'mobx-react';
import { cn } from '@bem-react/classname';
import j from 'join';

const cnTimeLine = cn('TimeLine');

const TimeLine = inject('playerStore')(observer(({ className, playerStore, live }) => {
  const { getPercent, setByPercent } = playerStore;

  function onClick(e) {
    const { offsetX, target } = e.nativeEvent;

    // Не совсем корректно брать из target ширину, потому что может быть клик по вложенному эелментуы и там др ширина
    const newPercent = offsetX / target.offsetWidth * 100;

    setByPercent(newPercent);
  }
  return (
    <div className={j(cnTimeLine(), className)} onClick={onClick}>
      <div style={{ width: `${getPercent}%` }} className={cnTimeLine('Current')} />
    </div>
  );
}));

export default TimeLine;
