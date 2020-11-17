import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';
import query from 'query';
import { tracksPath } from 'helpers/constants';
import { TracksStore } from './utils/tracksStore';

class PageStore extends TracksStore {
    @observable isLoading = false

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
      searchStr,
      limit,
    }) {
      if (this.isLoading || this.noTracksToFetch) return;

      if (resetBefore) this.resetTracks();

      if (resetFilters) {
        this.filterChannel = null;
        this.filterTags.clear();
        this.searchStr = null;
      }

      this.isLoading = true;

      // Если пришли параметры, то перезапишем
      if (channel) this.filterChannel = channel;
      if (tags) this.filterTags.replace(tags);
      if (searchStr) this.searchStr = searchStr;

      const { filterTags, filterChannel, filterLiveOnly } = this;

      axios.get(tracksPath, {
        params: {
          fromObjId,
          afterObjId,
          liveOnly: filterLiveOnly,
          tags: filterTags,
          channel: filterChannel,
          limit,
          searchStr,
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

          this.isLoading = false;
        }))
        .catch(err => runInAction(() => {
          this.isLoading = false;

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

    @action.bound
    fetchPageTracks({ ...args }) {
      this.fetch({
        ...args,
        limit: 30,

        // callback: {
        //   noData: this.callbackHasData,
        // },
      });
    }

    @action.bound
    firstFetchPageTracks({ ...args }) {
      this.updateAppData();
      this.updateFilters({ ...args });
      this.updateMetaData();

      this.fetchPageTracks({
        ...args,
        // callback: {
        //   beforeFetch(callbackArgs) {
        //     callback && callback(callbackArgs);
        //     this.scrollToTop();
        //   },
        // },
        rewrite: true,
        callback: this.scrollToTop,
        resetBefore: true,
      });
    }

    @action.bound
    updateMetaData() {
      this.isTracksLoading = false;
      this.noTracksToFetch = false;
    }

    @action.bound
    updateAppData() {
      this.resetTracks();
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

    get tracksLength() {
      return this.tracks.length;
    }

    get lastTrack() {
      return this.tracks[this.tracksLength - 1];
    }
}

export default new PageStore();
