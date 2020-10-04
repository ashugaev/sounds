import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn as bemCn } from '@bem-react/classname';
import { get } from 'lodash-es';
import j from 'join';
import TracksList from 'c/ItemsBlock';
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
    currentChannel, fetchCurrentChannel,
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

    fetchCurrentChannel(channelId);
  }, []);

  return (
    <div className={j(className, cn())}>
      <TracksList type="tracks" title={get(currentChannel, 'snippet.title')} />
    </div>
  );
}));

export default OneChannel;
