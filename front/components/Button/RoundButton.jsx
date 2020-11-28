import React from 'react';
import Icon from 'c/Icon';
import Text from 'c/Text';
import j from 'join';
import cnByModifiers from 'helpers/cnByModifiers';
import s from './RoundButton.sass';

const RoundButton = ({
  icon,
  onClick,
  size,
  className,
  isHidden,
  theme,
  text,
  onClickArgs,
  disabled,
  iconClassName,
  textColor,
  isActive,
  outlined,
}) => {
  const buttonModifiers = cnByModifiers({
    s,
    root: 'Button',
    mods: {
      size,
      outlined,
      theme,
      icon,
      disabled,
      textColor,
      withIcon: Boolean(icon),
      isActive,
    },
  });

  function onButtonClick(e) {
    if (disabled) return;

    onClick(onClickArgs, e);
  }

  return (
    !isHidden && (
    <div className={j(s.Button, ...buttonModifiers, className)} onClick={onButtonClick}>
      {icon && <Icon icon={icon} size={size} className={iconClassName} isActive={isActive} />}
      {text && <Text text={text} size={size} color={textColor} className={s.Text} />}
    </div>
    )
  );
};

RoundButton.defaultProps = {
  onClick: () => {},
};

export default React.memo(RoundButton);
