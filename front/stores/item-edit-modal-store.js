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

class ChannelEditModalStore {
  @observable modalIsOpen = false

  @observable modalChannelImages = []

  @observable modalChannelData = {}

  @action.bound
  channelEditModalOpen() {
    this.modalIsOpen = true;
  }

  @action.bound
  channelEditModalClose() {
    this.modalIsOpen = false;
  }
}

export default new ChannelEditModalStore();
