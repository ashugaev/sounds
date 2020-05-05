import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn as bemCn } from '@bem-react/classname';
import { get } from 'lodash-es';
import j from 'join';
import TracksList from 'c/TracksList';
import './OneChannel.sass';

const cn = bemCn('OneChannelPage');

function getTitle(channels, id) {
  const currentChannel = channels.find(el => el.id === id);
  // Пустая строка, что бы сработал ифак на наличие тайтла
  let title = ' ';

  if (currentChannel) {
    title = get(currentChannel, 'snippet.title');
  }

  return title;
}

const OneChannel = inject('pageStore', 'channelsStore')(observer(({
  className,
  pageStore,
  match,
  channelsStore,
}) => {
  const channelId = get(match, 'params.id');
  const { allChannels, fetchChannels } = channelsStore;
  const {
    setFilterChannel,
  } = pageStore;

  useEffect(() => {
    setFilterChannel({
      resetBefore: true,
      id: channelId,
    });

    // FIX: Пока что фетчатся все каналы, но в перспективе нужен один
    fetchChannels({ rewrite: true });
  }, []);

  return (
    <div className={j(className, cn())}>
      <TracksList type="tracks" title={getTitle(allChannels, channelId)} />
    </div>
  );
}));

export default OneChannel;
