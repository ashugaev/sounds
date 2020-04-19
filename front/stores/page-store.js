import {
  observable, action, runInAction,
} from 'mobx';
import axios from 'axios';

class PageStore {
  @observable tracks = []

  @observable isLoading = false

  @observable noTracksToFetch = false

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
  }) {
    if (this.isLoading || this.noTracksToFetch) return;

    this.isLoading = true;

    axios.get('/api/tracks', {
      params: {
        fromObjId,
        afterObjId,
        tags,
        channel,
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

        this.isLoading = false;
      }))
      .catch(err => runInAction(() => {
        this.isLoading = false;

        console.log(err);
      }));
  }

  get lastTrack() {
    return this.tracks[this.tracks.length - 1];
  }
}

export default new PageStore();
