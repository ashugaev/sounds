import { observable } from 'mobx';

/**
 * Общее для pageStore и playerStore
 */

export class TracksStore {
  // Filter Parameters
  @observable filterTags = []

  @observable filterChannel

  @observable filterStr
}
