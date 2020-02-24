import {
  observable, action, computed,
} from 'mobx';

class NotifierStore {
  @observable list = []

  @action.bound killLastNotify() {
    this.list.splice(-1);
  }

  @action.bound createNotify({ text, icon, callback }) {
    this.list.push({ text, icon, callback });
  }

  @computed get lastNotify() {
    return this.list[this.list.length - 1];
  }
}

export default new NotifierStore();
