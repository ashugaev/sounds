import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import j from 'join';
import Button from 'c/Button';
import query from 'query';
import TagButton from 'c/TagButton';
import VideoPlayer from 'c/VideoPlayer';
import TimeLine from 'c/TimeLine';
import Time from 'c/Time';
import Text from 'c/Text';
import get from 'lodash-es/get';
import { withRouter } from 'react-router';
import { showLastTrackNotifier } from '../../helpers/lastTrackNotifier';
import './PlayerBox.sass';

const PlayerBox = inject('tracksStore', 'playerStore', 'notifierStore', 'pageStore')(observer(({
  className, tracksStore, playerStore, history, notifierStore, pageStore,
}) => {
  const {
    track,
    onNextClick,
    onPrevClick,
    fetch: tracksFetch,
    isLoading,
    tracksLength,
    isNextArrowDisabled,
    isPrevArrowDisabled,
  } = tracksStore;

  const { createNotify } = notifierStore;

  const {
    isPlaying, toggleIsPlaying,
  } = playerStore;

  useEffect(() => {
    const urlQueries = query.get(history);

    // eslint-disable-next-line prefer-const
    let { playerChannel, trackObjId, playerTags } = urlQueries;

    playerTags = playerTags && playerTags.split(',');

    tracksFetch({
      fromObjId: trackObjId,
      tags: playerTags,
      channel: playerChannel,
      checkPrevTracks: true,
    });

    // Предлагает продолжить слушать тег/трек
    showLastTrackNotifier(createNotify, fetch, history);
  }, []);

  if (!track || (isLoading && !tracksLength)) return null;

  const { tags, snippet, tagsIsLoaded } = track;
  const {
    title, thumbnails, liveBroadcastContent, channelTitle,
  } = snippet;
  const imageUrl = thumbnails.high.url;

  const cnPlayerBox = cn('PlayerBox');

  return (
    <>
      <div className={j(cnPlayerBox(), className)}>
        <TimeLine className={cnPlayerBox('TimeLine')} />
        <div className={cnPlayerBox('Image')} style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="PlayerBox-ButtonsBox">
            <Button icon="prev" disabled={isPrevArrowDisabled} className={cnPlayerBox('PrevButton')} onClick={onPrevClick} />
            <Button
              icon={isPlaying ? 'pause' : 'play'}
              className={cnPlayerBox('PrevButton')}
              iconClassName={cnPlayerBox(isPlaying ? 'PauseIcon' : 'PlayIcon')}
              onClick={toggleIsPlaying}
              onClickArgs={!isPlaying}
              size="l"
            />
            <Button icon="next" disabled={isNextArrowDisabled} className={cnPlayerBox('NextButton')} onClick={onNextClick} />
          </div>
          <Time className="PlayerBox-TimeLabel" live={liveBroadcastContent === 'live'} />
        </div>
        <div className={cnPlayerBox('InfoBox')}>
          <div className={cnPlayerBox('Row')}>
            <div className={cnPlayerBox('Column')}>
              <Text size="s" text={title} bold cropLine />
              <Text size="xs" text={channelTitle} cropLine />
            </div>
            <div className={cnPlayerBox('Column')}>
              <Button icon="mix" onClick={() => console.log('mix everything')} />
            </div>
          </div>
          <div className="PlayerBox-TagsBox">
            {tagsIsLoaded && (tags || []).filter(tag => tag).map((tag, i) => {
              return (
                <TagButton
                  id={tag._id}
                  key={i}
                  text={tag.name}
                  theme="miniLabel"
                  className={cnPlayerBox('Tag')}
                />
              );
            })}
          </div>
        </div>
      </div>
      <VideoPlayer videoId={get(track, 'id.videoId')} isPlaying={isPlaying} />
    </>
  );
}));

export default withRouter(PlayerBox);
