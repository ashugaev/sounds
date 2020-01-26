import React from 'react';
import './Icon.sass';
import { cn } from '@bem-react/classname';

const Icon = ({
  size, className, isHidden, name,
}) => {
  const cnButton = cn('Icon')({
    size, name, isHidden,
  });

  return (
    <div className={`${cnButton} ${className || ''}`} />
  );
};

Icon.defaultProps = {
  size: 'm',
};

export default Icon;
