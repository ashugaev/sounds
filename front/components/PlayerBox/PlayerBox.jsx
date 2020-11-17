import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
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
import s from './PlayerBox.sass';
import {livePath} from "helpers/constants";

const PlayerBox = inject('playerTracksStore', 'playerStore', 'notifierStore', 'pageStore')(observer(({
  className, playerTracksStore, playerStore, history, notifierStore,
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
  } = playerTracksStore;

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
      filterLiveOnly: get(history, 'location.pathname') === livePath,
    }, [tracksFetch]);

    // Предлагает продолжить слушать тег/трек
    showLastTrackNotifier(createNotify, fetch, history);
  }, []);

  if (!track || (isLoading && !tracksLength)) return null;

  const { tags, snippet, tagsIsLoaded } = track;
  const {
    title, thumbnails, liveBroadcastContent, channelTitle,
  } = snippet;
  const imageUrl = thumbnails.high.url;

  return (
    <>
      <div className={j(s.PlayerBox, className)}>
        <TimeLine className={s.TimeLine} />
        <div className={s.Image} style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className={s.ButtonsBox}>
            <Button icon="prev" disabled={isPrevArrowDisabled} className={s.PrevButton} onClick={onPrevClick} />
            <Button
              icon={isPlaying ? 'pause' : 'play'}
              className={s.PrevButton}
              iconClassName={isPlaying ? s.PauseIcon : s.PlayIcon}
              onClick={toggleIsPlaying}
              onClickArgs={!isPlaying}
              size="l"
            />
            <Button icon="next" disabled={isNextArrowDisabled} className={s.NextButton} onClick={onNextClick} />
          </div>
          <Time className={s.TimeLabel} live={liveBroadcastContent === 'live'} />
        </div>
        <div className={s.InfoBox}>
          <div className={s.Row}>
            <div className={s.Column}>
              <Text size="s" text={title} bold cropLine />
              <Text size="xs" text={channelTitle} cropLine />
            </div>
            {/* <div className={s.Column}> */}
            {/*  <Button icon="mix" /> */}
            {/* </div> */}
          </div>
          <div className={s.TagsBox}>
            {tagsIsLoaded && (tags || []).filter(tag => tag).map((tag, i) => {
              return (
                <TagButton
                  id={tag._id}
                  key={i}
                  text={tag.name}
                  theme="miniLabel"
                  className={s.Tag}
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
