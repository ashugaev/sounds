import React from 'react';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { editText } from 'constants/texts';
import ChannelListItem from 'c/ChannelListItem';
import s from './ItemEditModal.sass';
import ImagesBlock from './ImagesBlock';
import Loader from '../Loader';
import TagsEditor from './TagsEditor';

const ItemEditModal = inject('itemEditModalStore', 'channelsStore')(observer(({
  itemEditModalStore, channelsStore,
}) => {
  const {
    modalIsOpen,
    onItemEditModalClose,
    channelData,
    modalItemImages,
    setWrapImage,
    modalItemImagesLoading,
    saveChannelData,
    channelCategoryIds,
  } = itemEditModalStore;

  const { updateChannelImage } = channelsStore;

  const {
    id, title, logoImageUrl, wrapImageUrl,
  } = channelData;

  const onOk = () => saveChannelData(() => updateChannelImage({ wrapImageUrl, id }));

  return (
    <Modal
      title={editText}
      visible={modalIsOpen}
      onOk={onOk}
      onCancel={onItemEditModalClose}
    >
      <div className={s.Content}>
        <ChannelListItem
          id={id}
          title={title}
          logoImageUrl={logoImageUrl}
          wrapImageUrl={wrapImageUrl}
          isDemo
          className={s.ChannelItem}
          categoriesIds={channelCategoryIds}
        />
        {modalItemImagesLoading ? (
          <Loader />
        ) : (
          <ImagesBlock
            className={s.ImagesBlock}
            onClick={setWrapImage}
            items={modalItemImages}
          />
        )}
        {/*<TagsEditor />*/}
      </div>
    </Modal>
  );
}));

export default ItemEditModal;
