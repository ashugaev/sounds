import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class ChannelsStore {
  @observable allChannels = [];

  @observable noChannelsToFetch = false;

  @observable currentChannel = {}

  /**
   * @param rewrite
   * @param callback - в него всегда пробрасывается первым аргументом результат фетча
   * @param callbackArgs
   * @param channelId
   */
  @action.bound fetchChannels({
    rewrite, callback, callbackArgs, channelId,
  }) {
    this.noChannelsToFetch = false;
    this.currentChannel = {};

    axious.get('/api/channels/', {
      params: {
        channelId,
      },
    })
      .then(({ data }) => runInAction(() => {
        if (!channelId) {
          if (rewrite) {
            this.allChannels.replace(data);
          } else {
            this.allChannels.push(...data);
          }
        }

        this.noChannelsToFetch = true;

        callback && callback(data, callbackArgs);
      }))
      .catch((err) => {
        console.log(err);
      });
  }

  @action.bound setCurrentChannel(currentChannel) {
    this.currentChannel = currentChannel && currentChannel[0];
  }

  @action.bound fetchCurrentChannel(channelId) {
    this.fetchChannels({
      channelId,
      callback: this.setCurrentChannel,
    });
  }
}

export default new ChannelsStore();
