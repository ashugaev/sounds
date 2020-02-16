import React from 'react';
import './Icon.sass';
import { cn } from '@bem-react/classname';

const Icon = ({
  size, className, isHidden, icon, color,
}) => {
  const cnButton = cn('Icon')({
    size, icon, isHidden, color,
  });

  return (
    <div className={`${cnButton} ${className || ''}`} />
  );
};

Icon.defaultProps = {
  size: 'm',
  color: 'white',
};

export default Icon;
