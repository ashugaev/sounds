import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import j from 'join';
import TracksList from 'c/ItemsBlock';
import './Main.sass';

const cnMain = cn('MainPage');

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
    <div className={j(className, cnMain())}>
      <TracksList type="tracks" />
    </div>
  );
}));

export default Main;
