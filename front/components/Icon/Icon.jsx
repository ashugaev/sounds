import React from 'react';
import j from 'join';
import cnByModifiers from 'cnByModifiers';
import s from './Icon.sass';

const Icon = ({
  size, className, isHidden, icon, color, isActive, wide, opacity,
}) => {
  const modifiers = cnByModifiers({
    s,
    root: 'Icon',
    mods: {
      size,
      icon,
      color,
      isActive,
      isHidden,
      wide,
      opacity,
    },
  });

  return (
    <div className={j(s.Icon, className, ...modifiers)} />
  );
};

Icon.defaultProps = {
  size: 'm',
  color: 'white',
};

export default React.memo(Icon);
