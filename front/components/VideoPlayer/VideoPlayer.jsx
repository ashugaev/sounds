import React, { useEffect } from 'react';
import YouTubePlayer from 'youtube-player';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router';
import get from 'lodash-es/get';
import query from 'query';
import { setTrackToLocalStorage } from '../../helpers/lastTrackNotifier';

let player;

const playerStates = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
};

const VideoPlayer = inject('playerStore', 'playerTracksStore', 'tagsStore', 'pageStore')(observer(({
  playerStore, playerTracksStore, tagsStore, videoId, isPlaying, history, pageStore,
}) => {
  const { onPlay, onStop, newTimeValue } = playerStore;
  const {
    onNextClick, currentTrack, changeTrigger,
  } = playerTracksStore;
  const { fetchTagsByIds } = tagsStore;
  const { setTags } = pageStore;

  useEffect(() => {
    player = YouTubePlayer('player');

    player.unMute();

    player.on('stateChange', handlePlayerStateChange);
    player.on('ready', handlePlayerReady);

    updateTagsFromQueries();
  }, []);

  useEffect(() => {
    if (videoId) {
      player.loadVideoById(videoId).then(() => {
        // фиксит автоплей при переключении следующего трека
        isPlaying ? player.playVideo() : player.pauseVideo();
      });

      if (currentTrack.tags && !currentTrack.tagsIsLoaded) fetchTagsByIds(currentTrack.tags, setTags);

      updateTrackQuery();

      setTrackToLocalStorage(get(currentTrack, 'snippet.title'), videoId, currentTrack._id);
    }
  }, [videoId, changeTrigger]);

  useEffect(() => {
    isPlaying ? (
      player.playVideo()
    ) : (
      player.pauseVideo()
    );
  }, [isPlaying]);

  function handlePlayerStateChange({ data }) {
    if (data === playerStates.PLAYING) {
      onPlay();
    } else if (data === playerStates.ENDED) {
      onNextClick();
    } else if (data === playerStates.PAUSED) {
      onStop();
    } else if (data === playerStates.BUFFERING) {
      console.log('BUFFERING');
    } else {
      console.log('player state changed', data);
    }

    setTime();
  }

  function handlePlayerReady(data) {
    console.log('ready', data);
  }

  function updateTrackQuery() {
    query.set(history, 'trackId', videoId);
    query.set(history, 'trackObjId', currentTrack._id);
  }

  // TODO: Переписать логику тегов
  function updateTagsFromQueries() {
    // const { tags } = qs.parse(get(history, 'location.search'));

    // if (!tags) return;

    // setFilterTags(tags.split(','), history, true);
  }

  async function setTime() {
    const { setCurrentTime, setDuration } = playerStore;

    const cur = await player.getCurrentTime();
    const dur = await player.getDuration();

    setDuration(dur);
    setCurrentTime(cur);
  }


  /**
   * Устанавливает время проигрывания трега
   */
  useEffect(() => {
    player.seekTo(newTimeValue);
  }, [newTimeValue]);

  return (
    <div
      style={{ display: 'none' }}
      id="player"
    />
  );
}));

export default withRouter(VideoPlayer);
