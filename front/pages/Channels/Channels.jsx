import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import j from 'join';
import TracksList from 'c/ItemsBlock';
import s from './Channels.sass';

const Channels = inject('channelsStore')(observer(({
  className,
  channelsStore,
}) => {
  useEffect(() => {
    fetchChannels({ rewrite: true });
  }, []);

  const { fetchChannels } = channelsStore;

  return (
    <div className={j(className, s.ChannelsPage)}>
      <TracksList type="channels" />
    </div>
  );
}));

export default Channels;
