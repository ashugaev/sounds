import React from 'react';
import TracksListItem from 'c/TracksListItem';
import ChannelListItem from 'c/ChannelListItem';
import get from 'lodash-es/get';
import Text from 'c/Text';
import Loader from 'c/Loader';
import LazyLoader from 'c/LazyLoader';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import './TracksList.sass';

const cnTracksList = cn('TracksList');

function getContent(type, track, tracks, isPlaying, allChannels) {
  let content;

  switch (type) {
    case 'tracks':
      content = tracks.map(({ snippet, id, _id }) => (
        <TracksListItem
          key={_id}
          className={cnTracksList('Track')}
          title={get(snippet, 'title')}
          imageUrl={get(snippet, 'thumbnails.high.url')}
          isPlaying={(id.videoId === get(track, 'id.videoId')) && isPlaying}
          videoObjId={_id}
        />
      ));
      break;

    case 'channels':
      content = allChannels.map(({
        brandingSettings, statistics, snippet, id, _id, bgImage,
      }) => (
        <ChannelListItem
          key={_id}
          id={id}
          className={cnTracksList('Track')}
          title={get(snippet, 'title')}
          logoImageUrl={get(snippet, 'thumbnails.default.url')}
          wrapImageUrl={bgImage || get(brandingSettings, 'image.bannerMobileImageUrl')}
          subscriberCount={get(statistics, 'subscriberCount')}
          viewCount={get(statistics, 'viewCount')}
        />
      ));
      break;

    default:
      break;
  }

  return content;
}

const TracksList = inject('tracksStore', 'pageStore', 'playerStore', 'channelsStore')(observer(({
  tracksStore, pageStore, playerStore, type, channelsStore, title,
}) => {
  const { allChannels, noChannelsToFetch } = channelsStore;
  const { track } = tracksStore;
  const {
    tracks, isLoading, noTracksToFetch, fetch: pageFetch,
  } = pageStore;
  const { isPlaying } = playerStore;

  function loadMoreItems() {
    pageFetch({
      afterObjId: pageStore.lastTrack._id,
    });
  }

  return (
    <>
      {type === 'tracks' && (
        <LazyLoader
          loadHandler={loadMoreItems}
          pixelsLeftToLoad={600}
          skipLoads={isLoading || noTracksToFetch}
        />
      )}
      <div className={cnTracksList()}>
        {title ? (
          <Text
            text={title}
            size="xl"
            className={cnTracksList('Title')}
            line="normal"
            bold
            cropLine
          />
        ) : <div className={cnTracksList('UpperPlaceholder')} />}
        <div className={cnTracksList('List')}>
          {getContent(type, track, tracks, isPlaying, allChannels)}
        </div>
      </div>
      {((!noTracksToFetch && type === 'tracks') || (!noChannelsToFetch && type === 'channels'))
        ? <Loader />
        : <div className={cnTracksList('BottomPlaceholder')} />}
    </>
  );
}));

export default TracksList;
