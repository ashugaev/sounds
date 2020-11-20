import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';
import Text from 'c/Text';
import Button from 'c/Button';
import { get } from 'lodash-es';
import { withRouter } from 'react-router';
import Time from 'c/Time';
import s from './TracksListItem.sass';
import {isLivePage} from "helpers/isLivePage";

const TracksListItem = inject('playerStore', 'playerTracksStore', 'pageStore')(observer(({
  imageUrl, title, isPlaying, playerStore, videoObjId, playerTracksStore, history, pageStore, isLive,
}) => {
  const { toggleIsPlaying } = playerStore;
  const {
    firstFetchPlayerTracks, currentTrack,
  } = playerTracksStore;
  const { filterTags, filterChannel } = pageStore;

  const toggleState = useCallback(() => {
    if (isPlaying) {
      toggleIsPlaying(false);
    } else {
      // Если это не тот трек, который сейчас в плеере, то фетчим данные
      if (videoObjId !== get(currentTrack, '_id')) {
        firstFetchPlayerTracks({
          fromObjId: videoObjId,
          tags: filterTags,
          channel: filterChannel,
          history,
          filterLiveOnly: isLivePage(history),
          callback: toggleIsPlaying,
          callbackArgs: true,
        });
      } else {
        toggleIsPlaying(true);
      }
    }
  });

  const trackItemClassName = cn(s.TracksListItem, { [s.TracksListItem_isPlaying]: isPlaying });

  return (
    <div className={trackItemClassName} onClick={toggleState}>
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
