import {
  observable, action,
} from 'mobx';

/**
 * Общее для pageStore и playerStore
 */

export class TracksStoreCommon {
  // Filter Parameters

  // TODO: Перейти на строку вместо массива, либо класть в тело запроса
  @observable filterTags = []

  @observable filterChannel

  @observable filterStr

  @observable filterLiveOnly

  // App data variables

  @observable tracks = []

  // Meta data variables

  @observable tracksLimit


  @action.bound resetTracks() {
    this.tracks.clear();
  }

  get tracksLength() {
    return this.tracks.length;
  }

  get lastTrack() {
    return this.tracks[this.tracksLength - 1];
  }

  @action.bound
  updateFilters({
    filterStr,
    filterLiveOnly,
    filterChannel,
    filterTags,
  }) {
    if (filterTags) {
      this.filterTags.replace = filterTags;
    } else {
      this.filterTags.clear();
    }

    this.filterChannel = filterChannel;
    this.filterStr = filterStr;
    this.filterLiveOnly = filterLiveOnly;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
