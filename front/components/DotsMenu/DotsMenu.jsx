import React, { useEffect, useState } from 'react';
import Icon from 'c/Icon/Icon';
import query from 'helpers/query';
import { useHistory } from 'react-router';
import cn from 'classnames';
import { Menu, Dropdown } from 'antd';
import { editText } from 'constants/texts';
import { inject, observer } from 'mobx-react';
import s from './DotsMenu.sass';

let timerId;

const DotsMenu = inject('itemEditModalStore')(observer(({
  isVisible, channelData, channelCategories, itemEditModalStore,
}) => {
  const { onItemEditModalOpen } = itemEditModalStore;
  const [isPopOverVisible, setPopOverVisible] = useState(false);
  const history = useHistory();
  const isMarkingEnabled = query.hasParam(history, 'marking');
  const cnBox = cn(s.Box, { [s.Box_visible]: isVisible || isPopOverVisible });

  const onClick = (e) => {
    e.stopPropagation();
    setPopOverVisible(val => !val);
  };

  const closeDropDown = () => {
    timerId = setTimeout(() => {
      setPopOverVisible(val => !val);
    }, 500);
  };

  const unCloseDropDown = () => {
    clearTimeout(timerId);
    timerId = null;
  };

  const onEditClick = (e) => {
    e.stopPropagation();
    onItemEditModalOpen({ channelData, channelCategories });
  };

  useEffect(() => (unCloseDropDown()), []);

  const menu = (
    <Menu>
      <Menu.Item>
        <div
          onClick={onEditClick}
        >
          {editText}
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {isMarkingEnabled ? (
        <div
          className={cnBox}
          onClick={onClick}
          onMouseEnter={unCloseDropDown}
          onMouseLeave={closeDropDown}
        >
          <Dropdown
            trigger="click"
            overlay={menu}
            placement="bottomRight"
            visible={isPopOverVisible}
          >
            <Icon icon="dots" size="s" opacity="1" className={s.Dots} />
          </Dropdown>
        </div>
      ) : null}
    </>
  );
}));

export default DotsMenu;
