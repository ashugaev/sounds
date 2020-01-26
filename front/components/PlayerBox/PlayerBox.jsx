import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Button from 'c/Button';
import VideoPlayer from 'c/VideoPlayer';
import Time from 'c/Time';
import Text from 'c/Text';
import get from 'lodash-es/get';
import qs from 'query-string';
import { withRouter } from 'react-router';
import './PlayerBox.sass';

const PlayerBox = inject('tracksStore', 'playerStore')(observer(({
  className, tracksStore, playerStore, history,
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
    setFilterTags,
    filterTags,
  } = tracksStore;

  const {
    isPlaying, toggleIsPlaying,
  } = playerStore;

  useEffect(() => {
    let { trackId, tags } = qs.parse(get(history, 'location.search'));

    tags = tags && tags.split(',');

    // Первый fetch с параметрами из урла
    fetch(false, trackId, tags);
  }, []);

  if (isLoading && !tracksLength) return <div>Loading...</div>;
  if (!track) return <div>no tracks</div>;

  const { tags, snippet, tagsIsLoaded } = track;
  const { title, thumbnails, liveBroadcastContent } = snippet;
  const imageUrl = thumbnails.high.url;

  const cnButton = cn('PlayerBox');

  function ontagClick(ids) {
    setFilterTags(ids, history);
  }

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
              // TODO: Вынести эту кнопку тега (и ту, что в меню) в обертку, что бы не повторять логику в theme
              <Button
                onClickArgs={tag._id}
                onClick={ontagClick}
                key={i}
                theme={filterTags.includes(tag._id) ? 'activeLabel' : 'label'}
                text={tag.name}
              />
            ))}
          </div>
        </div>
      </div>
      <VideoPlayer videoId={get(track, 'id.videoId')} isPlaying={isPlaying} />
    </>
  );
}));

export default withRouter(PlayerBox);
