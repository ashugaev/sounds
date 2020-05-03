import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
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
        <Router>
          <Route exact path="/">
            <TracksList type="tracks" />
          </Route>
          <Route exact path="/channels">
            <TracksList type="channels" />
          </Route>
        </Router>
        <PlayerBox className={cnBody('PlayerBox')} />
      </div>
      <TagsMenu />
    </div>
  );
}));

export default Body;
