import React from 'react';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { editText } from 'constants/texts';
import ChannelListItem from 'c/ChannelListItem';
import s from './ItemEditModal.sass';
import ImagesBlock from './ImagesBlock';
import Loader from '../Loader';

const ItemEditModal = inject('itemEditModalStore')(observer(({
  itemEditModalStore,
}) => {
  const {
    modalIsOpen,
    onItemEditModalClose,
    channelData,
    modalItemImages,
    setWrapImage,
    modalItemImagesLoading,
  } = itemEditModalStore;

  const {
    id, title, logoImageUrl, wrapImageUrl,
  } = channelData;

  return (
    <Modal
      title={editText}
      visible={modalIsOpen}
      onOk={onItemEditModalClose}
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
      </div>
    </Modal>
  );
}));

export default ItemEditModal;
