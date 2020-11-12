import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import cn from 'classnames';
import PlayerBox from 'c/PlayerBox';
import Header from 'c/Header';
import Channels from 'p/Channels';
import OneChannel from 'p/OneChannel';
import OneCategory from 'p/OneCategory';
import Live from 'p/Live';
import Search from 'p/Search';
import Categories from 'p/Categories';
import ChannelWallpaper from 'c/ChannelWallpaper';
import { categoriesPath } from 'helpers/constants';
import s from './Body.sass';

const Body = () => {
  return (
    <div className={s.Body}>
      <Route exact path="/channel/:id" component={ChannelWallpaper} />
      <Header />
      <div className={cn(s.Content, { [s.Content_withNotifier]: false, [s.Content_withPlayer]: true })}>
        <Switch>
          <Route exact path="/" component={Categories} />
          <Route exact path={categoriesPath} component={Categories} />
          <Route exact path={`${categoriesPath}/:name`} component={OneCategory} />
          <Route exact path="/channels" component={Channels} />
          <Route exact path="/channel/:id" component={OneChannel} />
          <Route exact path="/live" component={Live} />
          <Route exact path="/search" component={Search} />
        </Switch>
        <PlayerBox className={s.PlayerBox} />
      </div>
    </div>
  );
};

export default withRouter(Body);
