import {
  observable, action, computed,
} from 'mobx';

class NotifierStore {
  @observable list = [
    {
      icon: 'play',
      text: 'Продолжить слушать Chill Music Mix',
    },
  ]

  @action.bound killLast() {
    console.log('killing', index);
  }

  @action.bound create(text, icon) {
    this.list.push({ text, icon });
  }

  @computed get lastElem() {
    return this.list[this.list.length - 1];
  }
}

export default new NotifierStore();
