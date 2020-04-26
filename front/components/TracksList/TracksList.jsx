import React from 'react';
import TracksListItem from 'c/TracksListItem';
import get from 'lodash-es/get';
import Text from 'c/Text';
import LazyLoader from 'c/LazyLoader';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import './TracksList.sass';

const cnTracksList = cn('TracksList');

const TracksList = inject('tracksStore', 'tagsStore', 'pageStore', 'playerStore')(observer(({
  tracksStore, tagsStore, pageStore, playerStore,
}) => {
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
        pixelsLeftToLoad={500}
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
          {tracks.map(({ snippet, id, _id }) => (
            <TracksListItem
              key={_id}
              className={cnTracksList('Track')}
              title={get(snippet, 'title')}
              description={get(snippet, 'description')}
              imageUrl={get(snippet, 'thumbnails.high.url')}
              isPlaying={(id.videoId === get(track, 'id.videoId')) && isPlaying}
              videoObjId={_id}
            />
          ))}
        </div>
      </div>
    </>
  );
}));

export default TracksList;
