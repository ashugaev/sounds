import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';
import { get } from 'lodash-es';
import query from 'query';

class TracksStore {
  @observable tracks = []

  @observable currentTrackIndex = 0

  @observable isLoading = false

  @observable page = 0

  @observable filterTags = []

  @observable filterChannel;

  @observable changeTrigger

  constructor() {
    this.minTracksForFetch = 7;
    this.noTracksToFetch = false;
  }

  get track() {
    return this.tracks[this.currentTrackIndex];
  }

  get tracksLength() {
    return this.tracks.length;
  }

  get isNextArrowDisabled() {
    return (this.currentTrackIndex + 1) >= this.tracks.length;
  }

  get isPrevArrowDisabled() {
    return this.currentTrackIndex <= 0;
  }

  /**
   * @param rewrite - перезаписать список треков (true обычно при смене тага)
   * @param fromId - id трека начиная с коророго хотим слушать
   */
  @action.bound fetch(rewrite, fromId, tags, channel) {
    if (this.isLoading) return;

    if (this.noTracksToFetch) return;

    if (channel) this.filterChannel = channel;

    const { page, filterTags, filterChannel } = this;

    this.isLoading = true;

    if (tags) this.filterTags.replace(tags);

    axios.get('/api/tracks', {
      params: {
        page,
        fromId,
        tags: filterTags,
        channel: filterChannel,
      },
    })
      .then(({ data }) => runInAction(() => {
        if (!data.length) {
          this.noTracksToFetch = true;
        } else {
          rewrite ? (
            this.tracks.replace(data)
          ) : (
            this.tracks.push(...data)
          );

          if (fromId) {
            const index = this.tracks.findIndex(track => get(track, 'id.videoId') === fromId);

            this.currentTrackIndex = index;
          }

          // Костыль, что бы стригерить перерендер плеера, если id при смене тега не поменялся
          this.changeTrigger = Math.random();
        }

        this.isLoading = false;
      }))
      .catch(err => runInAction(() => {
        this.isLoading = false;

        console.log(err);
      }));
  }

  @action.bound onNextClick() {
    if (this.isNextArrowDisabled) return;

    if ((this.tracks.length - this.currentTrackIndex) <= this.minTracksForFetch) {
      this.page++;
      this.fetch();
    }

    this.currentTrackIndex++;
  }

  @action.bound onPrevClick() {
    if (this.isPrevArrowDisabled) return;

    this.currentTrackIndex--;
  }

  @action.bound setTags(tags) {
    this.track.tags = tags;

    this.track.tagsIsLoaded = true;
  }

  @action.bound setFilterTags(tags, history, noResetTrackIndex) {
    this.filterTags.replace([].concat(tags));

    this.onTagChange({ tags, history, noResetTrackIndex });
  }

  @action.bound setFilterChannel(id, history, noResetTrackIndex) {
    this.filterChannel = id;

    this.onChannelChange({ id, history, noResetTrackIndex });
  }

  @action.bound removeFilterTags(history, noResetTrackIndex) {
    this.filterTags.clear();

    this.onTagChange({ history, noResetTrackIndex });
  }

  onTagChange({ tags, history, noResetTrackIndex }) {
    this.noTracksToFetch = false;
    this.page = 0;

    if (!noResetTrackIndex) this.currentTrackIndex = 0;

    this.fetch(true);

    query.set(history, 'tags', tags);
  }

  onChannelChange({ id, history, noResetTrackIndex }) {
    this.noTracksToFetch = false;
    this.page = 0;
    this.filterTags.replace = [];

    if (!noResetTrackIndex) this.currentTrackIndex = 0;

    this.fetch(true);

    query.set(history, 'channel', id);
  }
}

export default new TracksStore();
