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

  /**
   * @param rewrite - перезаписать список треков (true обычно при смене тага)
   * @param fromObjId - id трека начиная с коророго хотим слушать
   */
  // @action.bound fetch({
  //   rewrite,
  //   fromObjId,
  //   afterObjId,
  //   beforeObjId,
  //   checkPrevTracks,
  //   history,
  //   isPlayerClick,
  //   liveOnly,
  //   callback = {},
  //   callbackArgs,
  // }) {
  //   // Разобраться/вынести
  //   // if (isPlayerClick) {
  //   //   if (beforeObjId) {
  //   //     if (this.prevTracksIsLoading || this.noTracksToFetchBefore) return;
  //   //
  //   //     this.prevTracksIsLoading = true;
  //   //   } else {
  //   //     if (this.isTracksLoading || this.noTracksToFetchAfter) return;
  //   //
  //   //     this.isTracksLoading = true;
  //   //   }
  //   // }
  //   //
  //   // // Кажется можно вынести в другое место
  //   // // Сбросим фильтры, если не было параметрои и клик со страницы
  //   // if (!isPlayerClick && !get(tags, 'length') && !channel) {
  //   //   this.filterTags.clear();
  //   //   this.filterChannel = undefined;
  //   //
  //   //   query.remove(history, 'playerChannel');
  //   //   // Пока что тегов нет, но в перспективе будет нужно
  //   //   query.remove(history, 'playerTags');
  //   // }
  //   //
  //   // // Если пришли параметры, то перезапишем
  //   // if (channel) {
  //   //   this.filterChannel = channel;
  //   //   history && query.set(history, 'playerChannel', channel);
  //   //   this.resetStopParams();
  //   // }
  //   // if (tags) {
  //   //   this.filterTags.replace(tags);
  //   //   (history && tags.length) && query.set(history, 'playerTags', tags);
  //   //   this.resetStopParams();
  //   // }
  //
  //   callback.beforeFetch && callback.beforeFetch();
  //
  //   this.isTracksLoading = true;
  //
  //   const {
  //     filterTags, filterChannel, filterStr, filterLiveOnly, tracksLimit,
  //   } = this;
  //
  //   axios.get(tracksPath, {
  //     params: {
  //       fromObjId,
  //       afterObjId,
  //       beforeObjId,
  //       tags: filterTags,
  //       channel: filterChannel,
  //       searchStr: filterStr,
  //       liveOnly: filterLiveOnly,
  //       limit: tracksLimit,
  //     },
  //   })
  //     .then(({ data }) => runInAction(async () => {
  //       if (!data.length) {
  //         // beforeObjId && (this.noTracksToFetchBefore = true);
  //         // afterObjId && (this.noTracksToFetchAfter = true);
  //         callback.noData && callback.noData();
  //       } else {
  //         callback.hasData && callback.hasData();
  //
  //         this.modifyData(data);
  //
  //         if (rewrite) {
  //           this.tracks.replace(data);
  //         } else if (beforeObjId) {
  //           this.tracks.replace(data.concat(this.tracks));
  //           this.currentTrackIndex += data.length;
  //         } else {
  //           this.tracks.push(...data);
  //         }
  //
  //         if (fromObjId) {
  //           const index = this.tracks.findIndex(track => track._id === fromObjId);
  //
  //           this.currentTrackIndex = index || 0;
  //         }
  //
  //         // Костыль, что бы стригерить перерендер плеера, если id при смене тега не поменялся
  //         this.changeTrigger = Math.random();
  //       }
  //
  //       this.prevTracksIsLoading = false;
  //
  //       // TODO: Разобраться почему не работает в ифаке выше
  //       if (checkPrevTracks && data.length) {
  //         this.fetch({ beforeObjId: this.tracks[0]._id, channel: filterChannel, liveOnly });
  //       }
  //     }))
  //     .catch(err => runInAction(() => {
  //       this.prevTracksIsLoading = false;
  //
  //       console.error(err);
  //     }))
  //     .finally(() => {
  //       this.isTracksLoading = false;
  //     });
  // }

  // @action.bound
  // resetTracks() {
  //   this.tracks.clear();
  // }
  //
  // @action.bound
  // updateFilters({
  //   filterStr,
  //   filterLiveOnly,
  //   filterChannel,
  //   filterTags,
  // }) {
  //   if (filterTags) {
  //     this.filterTags.replace = filterTags;
  //   } else {
  //     this.filterTags.clear();
  //   }
  //
  //   this.filterChannel = filterChannel;
  //   this.filterStr = filterStr;
  //   this.filterLiveOnly = filterLiveOnly;
  // }
  //
  // @action.bound
  // updateMetaData({ limit }) {
  //   this.tracksLimit = limit;
  //   this.isTracksLoading = false;
  // }
  //
  // /**
  //  * Обновляет данные приложения, которые отрисовываются в UI
  //  */

  //
  // /**
  //  * Модифицирует исходные данные, добавляя в них допполя для удобства (вообще лучше вынести это в парсер)
  //  * @param data
  //  */
  // modifyData(data) {
  //   data.forEach((el) => {
  //     el.isLive = get(el, 'snippet.liveBroadcastContent') === 'live';
  //
  //     return el;
  //   });
  // }
  //
  // scrollToTop() {
  //   window.scrollTo(0, 0);
  // }
  //

  //
  // get tracksLength() {
  //   return this.tracks.length;
  // }
  //
}
