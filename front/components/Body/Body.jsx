import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { get } from 'lodash-es';
import PlayerBox from 'c/PlayerBox';
import './Body.sass';
import Header from 'c/Header';
import Main from 'p/Main';
import Channels from 'p/Channels';
import OneChannel from 'p/OneChannel';

const cnBody = cn('Body');

const PageWrapper = inject('channelsStore')(observer(({ channelsStore }) => {
  const { currentChannel } = channelsStore;

  const pageWrapperUrl = get(currentChannel, 'brandingSettings.image.bannerImageUrl');

  return (
    <div className={cnBody('PageWrapper')} style={pageWrapperUrl && { backgroundImage: `url(${pageWrapperUrl})` }} />
  );
}));

const Body = inject()(observer(() => {
  return (
    <div className={cnBody()}>
      <Header />
      <Switch>
        <Route exact path="/channel/:id" component={PageWrapper} />
      </Switch>
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
