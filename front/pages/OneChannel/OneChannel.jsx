import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash-es';
import j from 'join';
import ItemsBlock from 'c/ItemsBlock';
import PageTracksList from 'c/PageTracksList';
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
    <div
      className={j(className, s.OneChannelPage)}
    >
      <ItemsBlock
        title={get(currentChannel, 'snippet.title')}
        lazy
      >
        <PageTracksList />
      </ItemsBlock>
    </div>
  );
}));

export default OneChannel;
