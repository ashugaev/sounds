import React from 'react';
import Notifier from 'c/Notifier';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import PlayerBox from 'c/PlayerBox';
import TracksList from 'c/TracksList';
import TagsMenu from 'c/TagsMenu';
import './Body.sass';

const cnBody = cn('Body');

const Body = inject('notifierStore')(observer(({ notifierStore }) => {
  const { lastNotify } = notifierStore;

  return (
    <div className={cnBody()}>
      <Notifier />
      <div className={cnBody('Content', { withNotifier: Boolean(lastNotify), withPlayer: true })}>
        <TracksList />
        <PlayerBox className={cnBody('PlayerBox')} />
      </div>
      <TagsMenu />
    </div>
  );
}));

export default Body;
