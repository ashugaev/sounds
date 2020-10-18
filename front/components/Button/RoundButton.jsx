import React from 'react';
import Icon from 'c/Icon';
import Text from 'c/Text';
import cn from 'classnames';
import j from 'join';
import s from './RoundButton.sass';

const RoundButton = ({
  icon, onClick, size, className, isHidden, theme, text, onClickArgs, disabled, iconClassName, textColor, isActive,
}) => {
  const buttonClassName = cn({
    [s.Button_size]: size,
    [s.Button_theme]: theme,
    [s.Button_icon]: icon,
    [s.Button_disabled]: disabled,
    [s.Button_textColor]: textColor,
    [s.Button_withIcon]: Boolean(icon),
    [s.Button_isActive]: isActive,
  });

  function onButtonClick() {
    if (disabled) return;

    onClick(onClickArgs);
  }

  return (
    !isHidden && (
    <div className={j(buttonClassName, className)} onClick={onButtonClick}>
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
