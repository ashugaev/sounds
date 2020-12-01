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
  @observable modalIsOpen = true

  @observable modalItemImages = []

  @observable modalItemData = {}

  @action.bound
  onItemEditModalOpen() {
    this.modalIsOpen = true;
  }

  @action.bound
  onItemEditModalClose() {
    this.modalIsOpen = false;
  }
}

export default new ItemEditModalStore();
