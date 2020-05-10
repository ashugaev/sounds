import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import j from 'join';
import TracksList from 'c/TracksList';
import './Live.sass';

const cnMain = cn('LivePage');

const Live = inject('pageStore')(observer(({
  className,
  pageStore,
}) => {
  const { setFilterChannel } = pageStore;

  useEffect(() => {
    setFilterChannel({
      resetBefore: true,
      liveOnly: true,
    });
  }, []);

  return (
    <div className={j(className, cnMain())}>
      <TracksList type="tracks" liveOnly />
    </div>
  );
}));

export default Live;
