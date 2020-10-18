import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import j from 'join';
import TracksList from 'c/ItemsBlock';
import s from './Main.sass';

const Main = inject('pageStore')(observer(({
  className,
  pageStore,
}) => {
  const { setFilterChannel } = pageStore;

  useEffect(() => {
    setFilterChannel({
      resetBefore: true,
    });
  }, []);

  return (
    <div className={j(className, s.MainPage)}>
      <TracksList type="tracks" />
    </div>
  );
}));

export default Main;
