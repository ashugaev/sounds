import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn as bemCn } from '@bem-react/classname';
import j from 'join';
import TracksList from 'c/ItemsBlock';
import './Channels.sass';

const cn = bemCn('ChannelsPage');

const Channels = inject('channelsStore')(observer(({
  className,
  channelsStore,
}) => {
  useEffect(() => {
    fetchChannels({ rewrite: true });
  }, []);

  const { fetchChannels } = channelsStore;

  return (
    <div className={j(className, cn())}>
      <TracksList type="channels" />
    </div>
  );
}));

export default Channels;
