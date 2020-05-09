import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn as bemCn } from '@bem-react/classname';
import { get } from 'lodash-es';
import j from 'join';
import TracksList from 'c/TracksList';
import './OneChannel.sass';

const cn = bemCn('OneChannelPage');

const OneChannel = inject('pageStore', 'channelsStore')(observer(({
  className,
  pageStore,
  match,
  channelsStore,
}) => {
  const channelId = get(match, 'params.id');
  const {
    fetchChannels, setCurrentChannel, currentChannel,
  } = channelsStore;
  const {
    setFilterChannel,
  } = pageStore;

  useEffect(() => {
    // Фетч треков с новым каналом
    setFilterChannel({
      resetBefore: true,
      id: channelId,
    });

    // FIX: Пока что фетчатся все каналы, но в перспективе нужен один
    fetchChannels({ rewrite: true, callback: setCurrentChannel, callbackArgs: channelId });
  }, []);

  return (
    <div className={j(className, cn())}>
      <TracksList type="tracks" title={get(currentChannel, 'snippet.title') || ' '} />
    </div>
  );
}));

export default OneChannel;
