import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class ChannelsStore {
  @observable allChannels = [];
  @observable noChannelsToFetch = false;

  @action.bound fetchChannels({ rewrite }) {
    this.noChannelsToFetch = false;

    axious.get('/api/channels/')
      .then(({ data }) => runInAction(() => {
        if (rewrite) {
          this.allChannels.replace(data);
        } else {
          this.allChannels.push(...data);
        }

        this.noChannelsToFetch = true;
      }))
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new ChannelsStore();
