import React from 'react';
import './RoundButton.sass';
import { cn } from '@bem-react/classname';

const RoundButton = ({
  icon, onClick, size, className, isHidden, theme, text, onClickArgs, disabled,
}) => {
  const cnButton = cn('RoundButton')({
    size, theme, icon, disabled,
  });

  function onButtonClick() {
    if (disabled) return;

    onClick(onClickArgs);
  }

  return (
    !isHidden && (
    <div className={`${cnButton} ${className || ''}`} onClick={onButtonClick}>
      {text}
    </div>
    )
  );
};

export default RoundButton;
