import React from 'react';
import './Icon.sass';
import { cn } from '@bem-react/classname';

const Icon = ({
  size, className, isHidden, icon, color, isActive, wide,
}) => {
  const iconClass = isActive ? `${icon}-active` : icon;

  const cnButton = cn('Icon')({
    size, icon: iconClass, isHidden, color, wide,
  });

  return (
    <div className={`${cnButton} ${className || ''}`} />
  );
};

Icon.defaultProps = {
  size: 'm',
  color: 'white',
};

export default React.memo(Icon);
