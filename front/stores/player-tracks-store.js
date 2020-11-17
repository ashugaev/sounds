import {
  observable, action, runInAction,
} from 'mobx';
import { get } from 'lodash-es';
import axios from 'axios';
import query from 'query';
import { tracksPath } from 'helpers/constants';

class PlayerTracksStore {
  @observable tracks = []

  @observable prevTracksIsLoading = false

  @observable currentTrackIndex = 0

  @observable isLoading = false

  @observable filterTags = []

  @observable filterChannel

  @observable changeTrigger

  @observable filterLiveOnly

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
    history,
    isPlayerClick,
    callback,
    filterLiveOnly = this.filterLiveOnly,
    callbackArgs,
  }) {
    // Тут получается довольно таки запутанная и не продуманная логика. Нужно порефакторить
    // Проверка на плеер нужно для того, то бы плеерные ограничители не влияли на подгрузку по клику на элемент каталога
    if (isPlayerClick) {
      if (beforeObjId) {
        if (this.prevTracksIsLoading || this.noTracksToFetchBefore) return;

        this.prevTracksIsLoading = true;
      } else {
        if (this.isLoading || this.noTracksToFetchAfter) return;

        this.isLoading = true;
      }
    }

    // Сбросим фильтры, если не было параметрои и клик со страницы
    if (!isPlayerClick && !get(tags, 'length') && !channel) {
      this.filterTags.clear();
      this.filterChannel = undefined;
      this.filterLiveOnly = false;

      query.remove(history, 'playerChannel');
      // Пока что тегов нет, но в перспективе будет нужно
      query.remove(history, 'playerTags');
    }

    if (filterLiveOnly) {
      this.filterLiveOnly = filterLiveOnly;
    }

    // Если пришли параметры, то перезапишем
    if (channel) {
      this.filterChannel = channel;
      history && query.set(history, 'playerChannel', channel);
      this.resetStopParams();
    }
    if (tags) {
      this.filterTags.replace(tags);
      (history && tags.length) && query.set(history, 'playerTags', tags);
      this.resetStopParams();
    }

    const { filterTags, filterChannel } = this;

    axios.get(tracksPath, {
      params: {
        fromObjId,
        afterObjId,
        beforeObjId,
        tags: filterTags,
        channel: filterChannel,
        liveOnly: filterLiveOnly,
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

            this.currentTrackIndex = index || 0;
          }

          callback && callback(callbackArgs);

          // Костыль, что бы стригерить перерендер плеера, если id при смене тега не поменялся
          this.changeTrigger = Math.random();
        }

        this.isLoading = false;
        this.prevTracksIsLoading = false;

        // TODO: Разобраться почему не работает в ифаке выше
        if (checkPrevTracks && data.length) {
          this.fetch({ beforeObjId: this.tracks[0]._id, channel: filterChannel });
        }
      }))
      .catch(err => runInAction(() => {
        this.isLoading = false;
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

  @action.bound onNextClick() {
    if (this.isNextArrowDisabled) return;

    this.currentTrackIndex++;

    if ((this.tracks.length - this.currentTrackIndex) <= this.minTracksForFetch) {
      this.fetch({
        afterObjId: this.lastTrack._id,
        isPlayerClick: true,
      });
    }
  }

  @action.bound onPrevClick() {
    if (this.isPrevArrowDisabled) return;

    this.currentTrackIndex--;

    if (this.currentTrackIndex <= this.minTracksForFetch) {
      this.fetch({
        beforeObjId: this.tracks[0]._id,
        isPlayerClick: true,
      });
    }
  }

  /**
   * Добавляет теги к текущему треку
   */
  @action.bound setTags(tags) {
    this.track.tags = tags;

    this.track.tagsIsLoaded = true;
  }
}

export default new PlayerTracksStore();
