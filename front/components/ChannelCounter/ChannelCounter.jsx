import React from 'react';
import Text from 'c/Text';
import Icon from 'c/Icon';
import j from 'join';
import s from './ChannelCounter.sass';

function getText(text) {
  const intVal = parseInt(text);
  const decimalPlace = 1;

  const result = (intVal >= 1000000)
    ? (`${(intVal / 1000000).toFixed(decimalPlace)} млн.`)
    : intVal >= 1000
      ? (`${(intVal / 1000).toFixed(decimalPlace)} тыс.`)
      : intVal;

  // Выпиливаю знак после запятой, если там 0
  return result.toString().replace('.0', '');
}

const ChannelCounter = ({
  text,
  icon,
  className,
}) => {
  if (!text) return null;

  return (
    <div className={j(className, s.ChannelCounter)}>
      <Icon className={s.Icon} icon={icon} size="xxs" wide />
      <Text className={s.Text} text={getText(text)} color="gray" size="xs" />
    </div>
  );
};

export default ChannelCounter;
