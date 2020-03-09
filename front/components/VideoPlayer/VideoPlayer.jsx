import React, { useEffect } from 'react';
import YouTubePlayer from 'youtube-player';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router';
import qs from 'query-string';
import get from 'lodash-es/get';
import { setTrackToLocalStorage } from '../../helpers/lastTrackNotifier';

let player;

const playerStates = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
};

const VideoPlayer = inject('playerStore', 'tracksStore', 'tagsStore')(observer(({
  playerStore, tracksStore, tagsStore, videoId, isPlaying, history,
}) => {
  const { onPlay, onStop } = playerStore;
  const {
    onNextClick, track, setTags, changeTrigger, setFilterTags,
  } = tracksStore;
  const { fetchTagsByIds } = tagsStore;

  useEffect(() => {
    player = YouTubePlayer('player');

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

      if (track.tags && !track.tagsIsLoaded) fetchTagsByIds(track.tags, setTags);

      updateTrackQuery(videoId);

      setTrackToLocalStorage(get(track, 'snippet.title'), videoId);
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

  function updateTrackQuery(id) {
    if (!id || !history) return;

    const params = qs.parse(get(history, 'location.search'));

    params.trackId = id;

    history.push({
      search: `?${qs.stringify(params)}`,
    });
  }

  function updateTagsFromQueries() {
    const { tags } = qs.parse(get(history, 'location.search'));

    if (!tags) return;

    setFilterTags(tags.split(','), history, true);
  }

  async function setTime() {
    const { setCurrentTime, setDuration } = playerStore;

    const cur = await player.getCurrentTime();
    const dur = await player.getDuration();

    setDuration(dur);
    setCurrentTime(cur);
  }

  return (
    <div
      style={{ display: 'none' }}
      id="player"
    />
  );
}));

export default withRouter(VideoPlayer);
