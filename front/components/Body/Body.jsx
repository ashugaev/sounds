import React from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import PlayerBox from 'c/PlayerBox';
import TracksList from 'c/TracksList';
import TagsMenu from 'c/TagsMenu';
import './Body.sass';
import Header from 'c/Header';

const cnBody = cn('Body');

const Body = inject()(observer(() => {
  return (
    <div className={cnBody()}>
      <Header />
      <div className={cnBody('Content', { withNotifier: false, withPlayer: true })}>
        <TracksList />
        <PlayerBox className={cnBody('PlayerBox')} />
      </div>
      <TagsMenu />
    </div>
  );
}));

export default Body;
