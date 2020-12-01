import React from 'react';
import j from 'join';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import s from './ItemEditModal.sass';
import { editText } from 'constants/texts';

const ItemEditModal = inject('itemEditModalStore')(observer(({
  className, itemEditModalStore,
}) => {
  const { modalIsOpen, onItemEditModalClose } = itemEditModalStore;

  return (
    <Modal
      title={editText}
      visible={modalIsOpen}
      onOk={() => console.log('ok')}
      onCancel={onItemEditModalClose}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}));

export default ItemEditModal;
