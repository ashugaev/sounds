import React from 'react';
import TracksListItem from 'c/TracksListItem';
import get from 'lodash-es/get';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import './TracksList.sass';

const cnTracksList = cn('TracksList');

const TracksList = inject('tracksStore')(observer(({ tracksStore }) => {
  const { tracks } = tracksStore;

  return (
    <div className={cnTracksList()}>
      <h1 className={cnTracksList('Title')}>The Philip Glass Ensemble</h1>
      <div className={cnTracksList('List')}>
        {tracks.map(({ snippet }) => (
          <TracksListItem
            className={cnTracksList('Track')}
            title={get(snippet, 'title')}
            description={get(snippet, 'description')}
            imageUrl={get(snippet, 'thumbnails.high.url')}
          />
        ))}
      </div>
    </div>
  );
}));

export default TracksList;
