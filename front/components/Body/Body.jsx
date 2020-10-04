import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import PlayerBox from 'c/PlayerBox';
import './Body.sass';
import Header from 'c/Header';
import Channels from 'p/Channels';
import OneChannel from 'p/OneChannel';
import OneCategory from 'p/OneCategory';
import Live from 'p/Live';
import Categories from 'p/Categories';
import ChannelWallpaper from 'c/ChannelWallpaper';
import { categoriesPage } from 'helpers/constants';

const cnBody = cn('Body');

const Body = inject()(observer(() => {
  return (
    <div className={cnBody()}>
      <Route exact path="/channel/:id" component={ChannelWallpaper} />
      <Header />
      <div className={cnBody('Content', { withNotifier: false, withPlayer: true })}>
        <Switch>
          <Route exact path="/" component={Categories} />
          <Route exact path={`/${categoriesPage}`} component={Categories} />
          <Route exact path={`/${categoriesPage}/:name`} component={OneCategory} />
          <Route exact path="/channels" component={Channels} />
          <Route exact path="/channel/:id" component={OneChannel} />
          <Route exact path="/live" component={Live} />
        </Switch>
        <PlayerBox className={cnBody('PlayerBox')} />
      </div>
    </div>
  );
}));

export default Body;
