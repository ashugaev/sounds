import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Button from 'c/Button';
import VideoPlayer from 'c/VideoPlayer';
import Time from 'c/Time';
import Text from 'c/Text';
import get from 'lodash-es/get';
import './PlayerBox.sass';

const PlayerBox = inject('tracksStore', 'playerStore')(observer(({ className, tracksStore, playerStore }) => {
  const {
    track,
    onNextClick,
    onPrevClick,
    fetch,
    isLoading,
    tracksLength,
    isNextArrowDisabled,
    isPrevArrowDisabled,
    setFilterTags,
  } = tracksStore;

  const {
    isPlaying, toggleIsPlaying,
  } = playerStore;

  useEffect(() => {
    fetch();
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
              className="PlayerBox-PrevButton"
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
            {tagsIsLoaded && (tags || []).filter(tag => tag).map((tag, i) => (
              <Button onClickArgs={tag._id} onClick={setFilterTags} key={i} theme="label" text={tag.name} />
            ))}
          </div>
        </div>
      </div>
      <VideoPlayer videoId={get(track, 'id.videoId')} isPlaying={isPlaying} />
    </>
  );
}));

export default PlayerBox;
