import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class ChannelsStore {
  @observable allChannels = [];

  @observable noChannelsToFetch = false;

  @observable currentChannel = {}

  @action.bound fetchChannels({ rewrite, callback, callbackArgs }) {
    this.noChannelsToFetch = false;
    this.currentChannel = {};

    axious.get('/api/channels/')
      .then(({ data }) => runInAction(() => {
        if (rewrite) {
          this.allChannels.replace(data);
        } else {
          this.allChannels.push(...data);
        }

        this.noChannelsToFetch = true;

        callback && callback(callbackArgs);
      }))
      .catch((err) => {
        console.log(err);
      });
  }

  @action.bound setCurrentChannel(id) {
    this.currentChannel = this.allChannels.find(el => el.id === id);
  }
}

export default new ChannelsStore();
