import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash-es';
import j from 'join';
import TracksList from 'c/ItemsBlock';
import s from './OneChannel.sass';

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
    firstFetchPageTracks,
  } = pageStore;

  useEffect(() => {
    firstFetchPageTracks({
      filterChannel: channelId,
    });

    // Фетчит допданные для страницы канала
    fetchCurrentChannel(channelId);
  }, []);

  return (
    <div className={j(className, s.OneChannelPage)}>
      <TracksList type="tracks" title={get(currentChannel, 'snippet.title')} titlePlaceholder />
    </div>
  );
}));

export default OneChannel;
