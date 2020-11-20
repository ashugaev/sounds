import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';
import { tracksPath } from 'helpers/constants';
import { TracksStoreCommon } from './utils/tracks-store-common';

class PageStore extends TracksStoreCommon {
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
      callback,
      callbackArgs,
      resetBefore,
      limit,
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
          limit,
          searchStr: this.filterStr,
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
}

export default new PageStore();
