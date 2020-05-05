import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import PlayerBox from 'c/PlayerBox';
import './Body.sass';
import Header from 'c/Header';
import Main from 'p/Main';
import Channels from 'p/Channels';
import OneChannel from 'p/OneChannel';

const cnBody = cn('Body');

const Body = inject()(observer(() => {
  return (
    <div className={cnBody()}>
      <Header />
      <div className={cnBody('Content', { withNotifier: false, withPlayer: true })}>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/channels" component={Channels} />
          <Route exact path="/channel/:id" component={OneChannel} />
        </Switch>
        <PlayerBox className={cnBody('PlayerBox')} />
      </div>
    </div>
  );
}));

export default Body;
