import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import j from 'join';
import TracksList from 'c/ItemsBlock';
import s from './Live.sass';

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
    <div className={j(className, s.LivePage)}>
      <TracksList type="tracks" liveOnly />
    </div>
  );
}));

export default Live;
