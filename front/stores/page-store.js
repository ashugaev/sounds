import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';
import query from 'query';
import { tracksPath } from 'helpers/constants';
import { TracksStore } from 'stores/utils/tracksStore';

class PageStore extends TracksStore {
  @observable tracks = []

  @observable isTracksLoading = false

  @observable noTracksToFetch = false

  /**
   * @param rewrite - перезаписать список треков
   * @param fromObjId - id трека начиная с которого хотим слушать
   */
  @action.bound
  fetch({
    rewrite,
    fromObjId,
    afterObjId,
    tags,
    channel,
    callback,
    callbackArgs,
    resetBefore,
    resetFilters,
    liveOnly,
    filterStr,
  }) {
    if (this.isTracksLoading || this.noTracksToFetch) return;

    if (resetBefore) this.resetTracks();

    if (resetFilters) {
      this.filterChannel = null;
      this.filterTags.clear();
      this.filterStr = null;
    }

    this.isTracksLoading = true;

    // Если пришли параметры, то перезапишем
    if (channel) super.filterChannel = channel;
    if (tags) this.filterTags.replace(tags);
    if (filterStr) this.filterStr = filterStr;

    const { filterTags, filterChannel } = this;

    axios.get(tracksPath, {
      params: {
        fromObjId,
        afterObjId,
        liveOnly,
        tags: filterTags,
        channel: filterChannel,
        limit: 30,
        filterStr,
      },
    })
      .then(({ data }) => runInAction(async () => {
        if (!data.length) {
          this.noTracksToFetch = true;
        } else if (rewrite) {
          this.tracks.replace(data);
        } else {
          this.tracks.push(...data);
        }

        callback && callback(callbackArgs);

        this.isTracksLoading = false;
      }))
      .catch(err => runInAction(() => {
        this.isTracksLoading = false;

        console.error(err);
      }));
  }

  @action.bound
  setFilterTags(tags, history) {
    this.filterTags.replace([].concat(tags));

    this.onTagChange({ tags, history });
  }

  @action.bound
  setFilterChannel({ id, resetBefore, liveOnly }) {
    this.filterChannel = id;

    this.onChannelChange({ resetBefore, liveOnly });
  }

  @action.bound
  removeFilterTags(history) {
    this.filterTags.clear();

    this.onTagChange({ history });
  }

  @action.bound resetTracks() {
    this.tracks.clear();
  }

  @action.bound
  fetchPageTracks({ filterStr }) {
    this.resetTracks();
    this.resetMeta();

    this.fetch({
      rewrite: true, callback: this.scrollToTop, resetBefore: true, filterStr,
    });
  }

  resetMeta() {
    this.noTracksToFetch = false;
    this.filterTags.replace = [];
  }

  onChannelChange({ resetBefore, liveOnly }) {
    this.filterTags.replace = [];

    this.onFilterChange({ resetBefore, liveOnly });
  }

  onTagChange({ tags, history }) {
    query.set(history, 'pageTags', tags);

    this.onFilterChange({});
  }

  onFilterChange({ resetBefore, liveOnly }) {
    this.noTracksToFetch = false;

    this.fetch({
      rewrite: true, callback: this.scrollToTop, resetBefore, liveOnly,
    });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  get lastTrack() {
    return this.tracks[this.tracks.length - 1];
  }
}

export default new PageStore();
