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
        brandingSettings, statistics, snippet, id, _id,
      }) => (
        <ChannelListItem
          key={_id}
          id={id}
          className={cnTracksList('Track')}
          title={get(snippet, 'title')}
          logoImageUrl={get(snippet, 'thumbnails.default.url')}
          wrapImageUrl={get(brandingSettings, 'image.bannerMobileImageUrl')}
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

const TracksList = inject('tracksStore', 'tagsStore', 'pageStore', 'playerStore', 'channelsStore')(observer(({
  tracksStore, tagsStore, pageStore, playerStore, type, channelsStore,
}) => {
  const { allChannels } = channelsStore;
  const { filterTags, track } = tracksStore;
  const {
    tracks, isLoading, noTracksToFetch, fetch: pageFetch,
  } = pageStore;
  const { allTags } = tagsStore;
  const { isPlaying } = playerStore;

  function getTitle() {
    const activeTagId = filterTags[0];

    if (activeTagId && allTags.length) {
      const activeTag = allTags.find(tag => tag._id === activeTagId);

      if (activeTag) {
        return activeTag.name;
      }
    }

    return 'All Tracks';
  }

  function loadMoreItems() {
    pageFetch({
      afterObjId: pageStore.lastTrack._id,
    });
  }

  return (
    <>
      <LazyLoader
        loadHandler={loadMoreItems}
        pixelsLeftToLoad={600}
        skipLoads={isLoading || noTracksToFetch}
      />
      <div className={cnTracksList()}>
        <Text
          text={getTitle()}
          size="xl"
          className={cnTracksList('Title')}
          bold
          cropLine
        />
        <div className={cnTracksList('List')}>
          {getContent(type, track, tracks, isPlaying, allChannels)}
        </div>
      </div>
      {!noTracksToFetch ? <Loader /> : <div className={cnTracksList('BottomPlaceholder')} />}
    </>
  );
}));

export default TracksList;
