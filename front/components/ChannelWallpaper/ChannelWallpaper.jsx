import React from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { get } from 'lodash-es';
import './ChannelWallpaper.sass';

const className = cn('ChannelWallpaper');

const ChannelWallpaper = inject('channelsStore')(observer(({ channelsStore }) => {
  const { currentChannel } = channelsStore;

  const pageWrapperUrl = get(currentChannel, 'brandingSettings.image.bannerImageUrl');

  return pageWrapperUrl
    ? <div className={className()} style={{ backgroundImage: `url(${pageWrapperUrl})` }} />
    : null;
}));

export default ChannelWallpaper;
