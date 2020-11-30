import React from 'react';
import Icon from 'c/Icon/Icon';
import query from 'helpers/query';
import { useHistory } from 'react-router';
import cn from 'classnames';
import s from './DotsMenu.sass';

const DotsMenu = ({ isVisible }) => {
  const history = useHistory();
  const isMarkingEnabled = query.hasParam(history, 'marking');

  const cnDotsMenu = cn(s.Dots, { [s.Dots_visible]: isVisible });

  return (
    <>
      {isMarkingEnabled ? (
        <Icon icon="dots" size="s" opacity="1" className={cnDotsMenu} />
      ) : null}
    </>
  );
};

export default DotsMenu;
