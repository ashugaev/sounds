import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';
import PlayerBox from 'c/PlayerBox';
import Header from 'c/Header';
import Channels from 'p/Channels';
import OneChannel from 'p/OneChannel';
import OneCategory from 'p/OneCategory';
import Live from 'p/Live';
import Categories from 'p/Categories';
import ChannelWallpaper from 'c/ChannelWallpaper';
import { categoriesPage } from 'helpers/constants';
import s from './Body.sass';

const Body = inject()(observer(() => {
  return (
    <div className={s.Body}>
      <Route exact path="/channel/:id" component={ChannelWallpaper} />
      <Header />
      <div className={cn(s.Content, { [s.Content_withNotifier]: false, [s.Content_withPlayer]: true })}>
        <Switch>
          <Route exact path="/" component={Categories} />
          <Route exact path={`/${categoriesPage}`} component={Categories} />
          <Route exact path={`/${categoriesPage}/:name`} component={OneCategory} />
          <Route exact path="/channels" component={Channels} />
          <Route exact path="/channel/:id" component={OneChannel} />
          <Route exact path="/live" component={Live} />
        </Switch>
        <PlayerBox className={s.PlayerBox} />
      </div>
    </div>
  );
}));

export default Body;
