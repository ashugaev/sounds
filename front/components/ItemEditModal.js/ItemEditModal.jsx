import React, { useEffect } from 'react';
import j from 'join';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { editText } from 'constants/texts';
import get from 'lodash-es/get';
import ChannelListItem from 'c/ChannelListItem';
import s from './ItemEditModal.sass';

const ItemEditModal = inject('itemEditModalStore')(observer(({
  itemEditModalStore,
}) => {
  const {
    modalIsOpen,
    onItemEditModalClose,
    channelCategories,
    channelData,
    fetchChannelImages,
  } = itemEditModalStore;

  const {
    id, title, logoImageUrl, wrapImageUrl,
  } = channelData;

  return (
    <Modal
      title={editText}
      visible={modalIsOpen}
      onOk={() => console.log('ok')}
      onCancel={onItemEditModalClose}
    >
      <div className={s.Header}>
        <ChannelListItem
          id={id}
          title={title}
          logoImageUrl={logoImageUrl}
          wrapImageUrl={wrapImageUrl}
          isDemo
        />
      </div>
    </Modal>
  );
}));

export default ItemEditModal;
