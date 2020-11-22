import {
  observable, action, runInAction,
} from 'mobx';
import { get } from 'lodash-es';
import axios from 'axios';
import query from 'query';
import { tracksPath } from 'helpers/constants';
import { TracksStoreCommon } from 'stores/utils/tracks-store-common';

class PlayerTracksStore extends TracksStoreCommon {
  @observable prevTracksIsLoading = false

  @observable nextTracksIsLoading = false

  @observable currentTrackIndex = 0

  @observable changeTrigger

  constructor() {
    super();

    // Треков должно остаться, что бы дофетчить новые
    this.minTracksForFetch = 3;
    this.noTracksToFetchBefore = false;
    this.noTracksToFetchAfter = false;
    this.limit = 6;
  }

  get currentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  get isNextArrowDisabled() {
    return (this.currentTrackIndex + 1) >= this.tracksLength;
  }

  get isPrevArrowDisabled() {
    return this.currentTrackIndex <= 0;
  }

  @action.bound fetch({
    rewrite,
    fromObjId,
    afterObjId,
    beforeObjId,
    checkPrevTracks,
    callback,
    callbackArgs,
  }) {
    axios.get(tracksPath, {
      params: {
        fromObjId,
        afterObjId,
        beforeObjId,
        tags: this.filterTags,
        channel: this.filterChannel,
        liveOnly: this.filterLiveOnly,
      },
    })
      .then(({ data }) => runInAction(async () => {
        if (!data.length) {
          beforeObjId && (this.noTracksToFetchBefore = true);
          afterObjId && (this.noTracksToFetchAfter = true);
        } else {
          this.modifyData(data);

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

            if (index === -1) {
              // Это условие срабатывает, когда зафетчили треги отличные от трков на странице
              console.error("Can't find index of track");
            } else {
              this.currentTrackIndex = index;
            }
          }

          callback && callback(callbackArgs);

          // Костыль, что бы стригерить перерендер плеера, если id при смене тега не поменялся
          this.changeTrigger = Math.random();
        }

        this.nextTracksIsLoading = false;
        this.prevTracksIsLoading = false;

        // TODO: Разобраться почему не работает в ифаке выше
        if (checkPrevTracks && data.length) {
          this.fetch({ beforeObjId: this.tracks[0]._id });
        }
      }))
      .catch(err => runInAction(() => {
        this.nextTracksIsLoading = false;
        this.prevTracksIsLoading = false;

        console.error(err);
      }));
  }

  /**
   * Модифицирует исходные данные, добавляя в них допполя для удобства (вообще лучше вынести это в парсер)
   * @param data
   */
  modifyData(data) {
    data.forEach((el) => {
      el.isLive = get(el, 'snippet.liveBroadcastContent') === 'live';

      return el;
    });
  }

  resetStopParams() {
    this.noTracksToFetchAfter = false;
    this.noTracksToFetchBefore = false;
  }

  /**
   * Клик на клавишу следующего трека
   */
  @action.bound onNextClick() {
    if (this.isNextArrowDisabled) return;

    this.currentTrackIndex++;

    const needMoreTracks = (this.tracksLength - this.currentTrackIndex) <= this.minTracksForFetch;

    if (needMoreTracks && !this.nextTracksIsLoading && !this.noTracksToFetchAfter) {
      this.nextTracksIsLoading = true;

      this.fetch({
        afterObjId: this.lastTrack._id,
      });
    }
  }

  /**
   * Клик на клавишу предыдущего трека
   */
  @action.bound onPrevClick() {
    if (this.isPrevArrowDisabled) return;

    this.currentTrackIndex--;

    const needMoreTracks = this.currentTrackIndex <= this.minTracksForFetch;

    if (needMoreTracks && !this.prevTracksIsLoading && !this.noTracksToFetchBefore) {
      this.prevTracksIsLoading = true;

      this.fetch({
        beforeObjId: this.tracks[0]._id,
      });
    }
  }

  /**
   * Добавляет теги к текущему треку
   */
  @action.bound
  setTags(tags) {
    this.track.tags = tags;

    this.track.tagsIsLoaded = true;
  }

  /**
   * Первый фетч треков для плеера
   */
  @action.bound
  firstFetchPlayerTracks({ ...args }) {
    this.updateFilters({ ...args });

    this.fetch({
      ...args,
      rewrite: true,
      checkPrevTracks: true,
    });
  }
}

export default new PlayerTracksStore();
