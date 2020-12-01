import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';
import { tracksPath } from 'constants';
import { TracksStoreCommon } from './utils/tracks-store-common';

class PageStore extends TracksStoreCommon {
    @observable isTracksLoading = false

    @observable noTracksToFetch = false

    constructor() {
      super();

      this.limit = 30;
    }

    @action.bound
    fetch({
      rewrite,
      fromObjId,
      afterObjId,
      callback,
      callbackArgs,
      resetBefore,
    }) {
      if (this.isTracksLoading || this.noTracksToFetch) return;

      if (resetBefore) this.resetTracks();

      this.isTracksLoading = true;

      axios.get(tracksPath, {
        params: {
          fromObjId,
          afterObjId,
          liveOnly: this.filterLiveOnly,
          tags: this.filterTags,
          channel: this.filterChannel,
          limit: this.limit,
          searchStr: this.filterStr,
          category: this.filterCategory,
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
        }))
        .catch((err) => {
          console.error(err);
        })
        .finally(() => runInAction(() => {
          this.isTracksLoading = false;
        }));
    }

    @action.bound
    fetchPageTracks({ ...args }) {
      this.fetch({
        ...args,
      });
    }

    @action.bound
    firstFetchPageTracks({ ...args }) {
      this.updateAppData();
      this.updateFilters({ ...args });
      this.updateMetaData();

      this.fetchPageTracks({
        ...args,
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
}

export default new PageStore();
