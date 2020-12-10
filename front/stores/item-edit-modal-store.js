/**
 * Константы
 * - isEditModalOpen
 * - channelImages
 * - channelData
 * - categoriesList
 * - categoryTypesList
 * - channelCategories
 *
 * Mетоды
 * - openEditModal(channelData, channelCategories)
 * - closeEditModal
 * - saveChannelData
 * - fetchChannelImages
 * - fetchCategories
 * - fetchCategoryTypes
 * - addCategory
 * - addCategoryType
 *
 * Новые методы в channel-store
 * - updateChannelData(channelData, i)
 */

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

  @observable channelCategories = []

  @observable channelCategoryIds = []

  @action.bound
  onItemEditModalOpen({ channelData, channelCategories, channelCategoryIds }) {
    this.modalIsOpen = true;
    this.channelData = channelData;
    this.channelCategories = channelCategories;
    this.channelCategoryIds = channelCategoryIds;

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
