import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import j from 'join';
import Button from 'c/Button';
import TagButton from 'c/TagButton';
import VideoPlayer from 'c/VideoPlayer';
import TimeLine from 'c/TimeLine';
import Time from 'c/Time';
import Text from 'c/Text';
import get from 'lodash-es/get';
import qs from 'query-string';
import { withRouter } from 'react-router';
import { showLastTrackNotifier } from '../../helpers/lastTrackNotifier';
import './PlayerBox.sass';

const PlayerBox = inject('tracksStore', 'playerStore', 'notifierStore')(observer(({
  className, tracksStore, playerStore, history, notifierStore,
}) => {
  const {
    track,
    onNextClick,
    onPrevClick,
    fetch,
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
    let { trackId, tags } = qs.parse(get(history, 'location.search'));

    tags = tags && tags.split(',');

    // Первый fetch с параметрами из урла
    fetch(false, trackId, tags);

    // Предлагает продолжить слушать тег/трек
    showLastTrackNotifier(createNotify, fetch);
  }, []);

  if (isLoading && !tracksLength) return <div>Loading...</div>;
  if (!track) return <div>no tracks</div>;

  const { tags, snippet, tagsIsLoaded } = track;
  const { title, thumbnails, liveBroadcastContent } = snippet;
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
        <div className="PlayerBox-InfoBox">
          <Text size="xxxl" text={title} />
          <div className="PlayerBox-TagsBox">
            {tagsIsLoaded && (tags || []).filter(tag => tag).map((tag, i) => {
              return (
                <TagButton
                  id={tag._id}
                  key={i}
                  text={tag.name}
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
