import React from 'react';
import Icon from 'c/Icon';
import Text from 'c/Text';
import './RoundButton.sass';
import { cn } from '@bem-react/classname';
import j from 'join';

const RoundButton = ({
  icon, onClick, size, className, isHidden, theme, text, onClickArgs, disabled, iconClassName, textColor, isActive,
}) => {
  const cnButton = cn('RoundButton');
  const buttonClassName = cnButton({
    size, theme, icon, disabled, textColor, withIcon: Boolean(icon), isActive,
  });

  function onButtonClick() {
    if (disabled) return;

    onClick(onClickArgs);
  }

  return (
    !isHidden && (
    <div className={j(buttonClassName, className)} onClick={onButtonClick}>
      {icon && <Icon icon={icon} size={size} className={iconClassName} />}
      {text && <Text text={text} size={size} color={textColor} className={cnButton('Text')} />}
    </div>
    )
  );
};

export default RoundButton;
