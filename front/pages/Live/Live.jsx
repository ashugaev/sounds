import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import j from 'join';
import TracksList from 'c/ItemsBlock';
import s from './Live.sass';

const Live = inject('pageStore')(observer(({
  className,
  pageStore,
}) => {
  const { firstFetchPageTracks } = pageStore;

  useEffect(() => {
    firstFetchPageTracks({
      filterLiveOnly: true,
    });
  }, []);

  return (
    <div className={j(className, s.LivePage)}>
      <TracksList type="tracks" />
    </div>
  );
}));

export default Live;
