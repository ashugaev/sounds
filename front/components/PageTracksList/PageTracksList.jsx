import React from 'react';
import get from 'lodash-es/get';
import { inject, observer } from 'mobx-react';
import TracksListItem from 'c/TracksListItem';


const PageTracksList = inject('playerTracksStore', 'playerStore', 'pageStore')(observer(({
  playerTracksStore, playerStore, pageStore,
}) => {
  const { currentTrack } = playerTracksStore;
  const { isPlaying } = playerStore;
  const { tracks } = pageStore;

  return (
    <>
      {tracks.map(({ snippet, id, _id }) => (
        <TracksListItem
          key={_id}
          title={get(snippet, 'title')}
          imageUrl={get(snippet, 'thumbnails.high.url')}
          isPlaying={(id.videoId === get(currentTrack, 'id.videoId')) && isPlaying}
          videoObjId={_id}
          isLive={get(snippet, 'liveBroadcastContent') === 'live'}
        />
      ))}
    </>
  );
}));

export default PageTracksList;
