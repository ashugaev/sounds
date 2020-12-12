import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class ItemEditModalStore {
  @observable modalIsOpen = false

  @observable modalItemImagesLoading = false

  @observable modalItemImages = []

  @observable modalItemData = {}

  @observable channelData = {}

  @action.bound
  onItemEditModalOpen({ channelData }) {
    this.modalIsOpen = true;
    this.channelData = channelData;

    this.fetchChannelImages({ id: channelData.id });
  }

  @action.bound
  onItemEditModalClose() {
    this.modalIsOpen = false;
  }

  @action.bound
  fetchChannelImages({ id, callback, callbackArgs }) {
    this.modalItemImagesLoading = true;

    axious.get('/api/channel_images/', {
      params: {
        id,
      },
    })
      .then(({ data }) => runInAction(() => {
        this.modalItemImages = data;

        callback && callback(data, callbackArgs);
      }))
      .catch((err) => {
        console.log(err);
      })
      .finally(() => runInAction(() => {
        this.modalItemImagesLoading = false;
      }));
  }

  @action.bound
  setWrapImage(url) {
    this.channelData.wrapImageUrl = url;
  }

  @action.bound
  saveChannelData(callback) {
    callback();
    this.modalIsOpen = false;

    const { id, wrapImageUrl } = this.channelData;

    axious.post('/api/channel_images/set_one', {
      id, wrapImageUrl,
    })
      .catch(e => console.error(e));
  }
}

export default new ItemEditModalStore();
