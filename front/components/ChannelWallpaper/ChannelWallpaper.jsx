import React from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash-es';
import s from './ChannelWallpaper.sass';

const ChannelWallpaper = inject('channelsStore')(observer(({ channelsStore }) => {
  const { currentChannel } = channelsStore;

  const pageWrapperUrl = get(currentChannel, 'brandingSettings.image.bannerImageUrl');

  return pageWrapperUrl
    ? <div className={s.ChannelWallpaper} style={{ backgroundImage: `url(${pageWrapperUrl})` }} />
    : null;
}));

export default ChannelWallpaper;
