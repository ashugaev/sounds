import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';

class TracksStore {
  @observable tracks = []

  @observable currentTrackIndex = 0

  @observable isLoading = false

  @observable page = 0

  @observable filterTags = []

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

  @action.bound fetch(rewrite) {
    if (this.noTracksToFetch) return;

    const { page, filterTags } = this;

    this.isLoading = true;

    axios.get('/api/tracks', {
      params: {
        page,
        tags: filterTags,
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

  @action.bound setFilterTags(tags) {
    this.noTracksToFetch = false;
    this.page = 0;
    this.currentTrackIndex = 0;
    this.filterTags.replace([].concat(tags));
    this.fetch(true);
  }
}

export default new TracksStore();
