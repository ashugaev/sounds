import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';
import Text from 'c/Text';
import Button from 'c/Button';
import { get } from 'lodash-es';
import { withRouter } from 'react-router';
import Time from 'c/Time';
import s from './TracksListItem.sass';

const TracksListItem = inject('playerStore', 'tracksStore', 'pageStore')(observer(({
  imageUrl, title, isPlaying, playerStore, videoObjId, tracksStore, history, pageStore, isLive,
}) => {
  const { toggleIsPlaying } = playerStore;
  const {
    fetch: tracksFetch, track,
  } = tracksStore;
  const { filterTags, filterChannel } = pageStore;

  const toggleState = useCallback(() => {
    if (isPlaying) {
      toggleIsPlaying(false);
    } else {
      // Если это не тот трек, который сейчас в плеере, то фетчим данные
      if (videoObjId !== get(track, '_id')) {
        tracksFetch({
          rewrite: true,
          fromObjId: videoObjId,
          tags: filterTags,
          channel: filterChannel,
          checkPrevTracks: true,
          history,
          liveOnly: get(history, 'location.pathname') === '/live',
          callback: toggleIsPlaying,
          callbackArgs: true,
        });
      } else {
        toggleIsPlaying(true);
      }
    }
  });

  return (
    <div className={cn(s.TracksListItem, { [s.isPlaying]: isPlaying })} onClick={toggleState}>
      <div className={s.Image} style={{ backgroundImage: `url(${imageUrl})` }}>
        {isLive && <Time live className={s.LiveLabel} />}
        <Button
          icon={isPlaying ? 'pause' : 'play'}
          className={s.PlayButton}
          size="l"
        />
      </div>
      <Text size="s" text={title} lines={2} className={s.Title} hoverable />
    </div>
  );
}));

export default withRouter(TracksListItem);
