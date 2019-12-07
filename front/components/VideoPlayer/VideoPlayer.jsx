import React, { useEffect } from 'react';
import YouTubePlayer from 'youtube-player';
import { observer, inject } from 'mobx-react';

let player;

const playerStates = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
};

const VideoPlayer = inject('playerStore', 'tracksStore', 'tagsStore')(observer(({
  playerStore, tracksStore, tagsStore, videoId, isPlaying,
}) => {
  const { onPlay, onStop } = playerStore;
  const {
    onNextClick, track, setTags, changeTrigger,
  } = tracksStore;
  const { fetchTagsByIds } = tagsStore;

  useEffect(() => {
    player = YouTubePlayer('player');

    player.on('stateChange', handlePlayerStateChange);
    player.on('ready', handlePlayerReady);
  }, []);

  useEffect(() => {
    if (videoId) {
      player.loadVideoById(videoId).then(() => {
        // фиксит автоплей при переключении следующего трека
        isPlaying ? player.playVideo() : player.pauseVideo();
      });

      if (track.tags && !track.tagsIsLoaded) fetchTagsByIds(track.tags, setTags);
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

export default VideoPlayer;
