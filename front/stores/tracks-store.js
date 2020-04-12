import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';
import query from 'query';

class TracksStore {
  @observable tracks = []

  @observable prevTracksIsLoadhng = false

  @observable currentTrackIndex = 0

  @observable isLoading = false

  @observable filterTags = []

  @observable filterChannel;

  @observable changeTrigger

  constructor() {
    this.minTracksForFetch = 3;
    this.noTracksToFetchBefore = false;
    this.noTracksToFetchAfter = false;
  }

  get track() {
    return this.tracks[this.currentTrackIndex];
  }

  get lastTrack() {
    return this.tracks[this.tracksLength - 1];
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
   * @param fromObjId - id трека начиная с коророго хотим слушать
   */
  @action.bound fetch({
    rewrite,
    fromObjId,
    afterObjId,
    beforeObjId,
    tags,
    channel,
    checkPrevTracks,
  }) {
    if (beforeObjId) {
      if (this.prevTracksIsLoadhng || this.noTracksToFetchBefore) return;

      this.prevTracksIsLoadhng = true;
    } else {
      if (this.isLoading || this.noTracksToFetchAfter) return;

      this.isLoading = true;
    }

    if (channel) this.filterChannel = channel;

    const { filterTags, filterChannel } = this;

    if (tags) this.filterTags.replace(tags);

    axios.get('/api/tracks', {
      params: {
        fromObjId,
        afterObjId,
        beforeObjId,
        tags: filterTags,
        channel: filterChannel,
      },
    })
      .then(({ data }) => runInAction(async () => {
        if (!data.length) {
          beforeObjId && (this.noTracksToFetchBefore = true);
          afterObjId && (this.noTracksToFetchAfter = true);
        } else {
          if (rewrite) {
            this.tracks.replace(data);
          } else if (beforeObjId) {
            this.tracks.replace(data.concat(this.tracks));
            this.currentTrackIndex += data.length;
          } else {
            this.tracks.push(...data);
          }

          if (fromObjId) {
            const index = this.tracks.findIndex(track => track._id === fromObjId);

            this.currentTrackIndex = index;
          }

          // Костыль, что бы стригерить перерендер плеера, если id при смене тега не поменялся
          this.changeTrigger = Math.random();
        }

        this.isLoading = false;
        this.prevTracksIsLoadhng = false;

        // TODO: Разобраться почему не работает в ифаке выше
        if (checkPrevTracks && data.length) {
          this.fetch({ beforeObjId: this.tracks[0]._id });
        }
      }))
      .catch(err => runInAction(() => {
        this.isLoading = false;
        this.prevTracksIsLoadhng = false;

        console.log(err);
      }));
  }

  @action.bound onNextClick() {
    if (this.isNextArrowDisabled) return;

    this.currentTrackIndex++;

    if ((this.tracks.length - this.currentTrackIndex) <= this.minTracksForFetch) {
      this.fetch({
        afterObjId: this.lastTrack._id,
      });
    }
  }

  @action.bound onPrevClick() {
    if (this.isPrevArrowDisabled) return;

    this.currentTrackIndex--;

    if (this.currentTrackIndex <= this.minTracksForFetch) {
      this.fetch({
        beforeObjId: this.tracks[0]._id,
      });
    }
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
    this.noTracksToFetchBefore = false;
    this.noTracksToFetchAfter = false;

    if (!noResetTrackIndex) this.currentTrackIndex = 0;

    this.fetch({ rewrite: true });

    query.set(history, 'tags', tags);
  }

  onChannelChange({ id, history, noResetTrackIndex }) {
    this.noTracksToFetchBefore = false;
    this.noTracksToFetchAfter = false;
    this.filterTags.replace = [];

    if (!noResetTrackIndex) this.currentTrackIndex = 0;

    this.fetch({ rewrite: true });

    query.set(history, 'channel', id);
  }
}

export default new TracksStore();
