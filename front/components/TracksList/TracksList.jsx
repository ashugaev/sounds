import React from 'react';
import TracksListItem from 'c/TracksListItem';
import get from 'lodash-es/get';
import Text from 'c/Text';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import './TracksList.sass';

const cnTracksList = cn('TracksList');

const TracksList = inject('tracksStore', 'tagsStore')(observer(({ tracksStore, tagsStore }) => {
  const { tracks, filterTags } = tracksStore;
  const { allTags } = tagsStore;

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

  return (
    <div className={cnTracksList()}>
      <Text
        text={getTitle()}
        size="xl"
        className={cnTracksList('Title')}
        bold
        cropLine
      />
      <div className={cnTracksList('List')}>
        {tracks.map(({ snippet }) => (
          <TracksListItem
            className={cnTracksList('Track')}
            title={get(snippet, 'title')}
            description={get(snippet, 'description')}
            imageUrl={get(snippet, 'thumbnails.high.url')}
            channelTitle={get(snippet, 'channelTitle')}
          />
        ))}
      </div>
    </div>
  );
}));

export default TracksList;
