import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';
import query from 'query';

class PageStore {
  @observable tracks = []

  @observable isLoading = false

  @observable noTracksToFetch = false

  @observable filterTags = []

  @observable filterChannel

  /**
   * @param rewrite - перезаписать список треков (true обычно при смене тага)
   * @param fromObjId - id трека начиная с коророго хотим слушать
   * @param onThePage - запрос для списка треков на странице
   */
  @action.bound fetch({
    rewrite,
    fromObjId,
    afterObjId,
    tags,
    channel,
    callback,
    resetBefore,
    resetFilters,
  }) {
    if (this.isLoading || this.noTracksToFetch) return;

    if (resetBefore) this.resetTracks();

    if (resetFilters) {
      this.filterChannel = undefined;
      this.filterTags.clear();
    }

    this.isLoading = true;

    // Если пришли параметры, то перезапишем
    if (channel) this.filterChannel = channel;
    if (tags) this.filterTags.replace(tags);

    const { filterTags, filterChannel } = this;

    axios.get('/api/tracks', {
      params: {
        fromObjId,
        afterObjId,
        tags: filterTags,
        channel: filterChannel,
        limit: 30,
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

        callback && callback();

        this.isLoading = false;
      }))
      .catch(err => runInAction(() => {
        this.isLoading = false;

        console.error(err);
      }));
  }

  @action.bound setFilterTags(tags, history) {
    this.filterTags.replace([].concat(tags));

    this.onTagChange({ tags, history });
  }

  @action.bound setFilterChannel({ id, history, resetBefore }) {
    this.filterChannel = id;

    this.onChannelChange({ id, history, resetBefore });
  }

  @action.bound removeFilterTags(history) {
    this.filterTags.clear();

    this.onTagChange({ history });
  }

  @action.bound resetTracks() {
    this.tracks.clear();
  }

  onChannelChange({ id, history, resetBefore }) {
    this.filterTags.replace = [];

    (id && history) && query.set(history, 'pageChannel', id);

    this.onFilterChange({ resetBefore });
  }

  onTagChange({ tags, history }) {
    query.set(history, 'pageTags', tags);

    this.onFilterChange();
  }

  onFilterChange({ resetBefore }) {
    this.noTracksToFetch = false;

    this.fetch({
      rewrite: true, callback: this.scrollToTop, resetBefore,
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
