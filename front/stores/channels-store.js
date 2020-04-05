import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class ChannelsStore {
  @observable allChannels = []

  @action.bound fetchChannels() {
    axious.get('/api/channels/')
      .then(({ data }) => runInAction(() => {
        this.allChannels.push(...data);
      }))
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new ChannelsStore();
