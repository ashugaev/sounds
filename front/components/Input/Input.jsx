import React from 'react';
import j from 'join';
import Icon from 'c/Icon';
import s from './Input.sass';

const Input = ({
  className, icon, value, placeholder, onChange,
}) => {
  return (
    <div className={j(s.Wrapper, className)} size="l">
      {icon && (
        <Icon
          icon={icon}
          className={s.Icon}
          size="s"
        />
      ) }
      <input
        className={s.Input}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

Input.defaultProps = {};

export default React.memo(Input);
