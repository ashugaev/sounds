import React from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Text from 'c/Text';
import Button from 'c/Button';
import './TracksListItem.sass';

const cnTracksListItem = cn('TracksListItem');

const TracksListItem = inject('playerStore', 'tracksStore')(observer(({
  imageUrl, title, channelTitle, isPlaying, playerStore, videoObjId, tracksStore,
}) => {
  const { toggleIsPlaying } = playerStore;
  const {
    fetch, filterTags, filterCnannel, track,
  } = tracksStore;

  function toggleState() {
    if (isPlaying) {
      toggleIsPlaying(false);
    } else {
      if (videoObjId !== track._id) {
        fetch({
          rewirite: true,
          fromObjId: videoObjId,
          tags: filterTags,
          channel: filterCnannel,
          checkPrevTracks: true,
        });
      }

      toggleIsPlaying(true);
    }
  }

  return (
    <div className={cnTracksListItem({ isPlaying })} onClick={toggleState}>
      <div className={cnTracksListItem('Image')} style={{ backgroundImage: `url(${imageUrl})` }}>
        <Button
          icon={isPlaying ? 'pause' : 'play'}
          className={cnTracksListItem('PrevButton')}
          iconClassName={cnTracksListItem('Button')}
          size="l"
        />
      </div>
      {/* <Text size="xs" text={channelTitle} cropLine className={cnTracksListItem('ChannelTitle')} /> */}
      <Text size="s" text={title} lines={2} className={cnTracksListItem('Title')} hoverable />
    </div>
  );
}));

export default TracksListItem;
