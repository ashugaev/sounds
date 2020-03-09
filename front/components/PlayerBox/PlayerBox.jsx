import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Button from 'c/Button';
import TagButton from 'c/TagButton';
import VideoPlayer from 'c/VideoPlayer';
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

  const cnButton = cn('PlayerBox');

  return (
    <>
      <div className={`${className || ''} ${cnButton()}`}>
        <div className={cnButton('Image')} style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="PlayerBox-ButtonsBox">
            <Button icon="prev" disabled={isPrevArrowDisabled} className="PlayerBox-PrevButton" onClick={onPrevClick} />
            <Button
              icon={isPlaying ? 'pause' : 'play'}
              className={cnButton('PrevButton')}
              iconClassName={cnButton(isPlaying ? 'PauseIcon' : 'PlayIcon')}
              onClick={toggleIsPlaying}
              onClickArgs={!isPlaying}
            />
            <Button icon="next" disabled={isNextArrowDisabled} className="PlayerBox-PrevButton" onClick={onNextClick} />
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
