import React  from 'react';
import cn from 'classnames';
import s from './ImagesBlock.sass';

const ImagesBlock = ({
  items,
  onClick,
  className,
}) => (
  <div className={cn(s.Wrapper, className)}>
    {items.map((el, i) => (
      <div
        key={i}
        className={s.Item}
        style={{ backgroundImage: `url(${el})` }}
        onClick={() => onClick(el)}
      />
    ))}
  </div>
);

export default ImagesBlock;
