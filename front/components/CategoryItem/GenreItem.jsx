import React from 'react';
import query from 'query';
import j from 'join';
import Text from 'c/Text';
import { withRouter } from 'react-router';
import cn from 'classnames';
import { setCategory } from 'helpers/setCategory';
import s from './GenreItem.sass';

const ChannelListItem = ({
  history,
  className,
  title,
  path,
  wrapImageUrl,
}) => {
  if (!title) return null;

  function onClick() {
    setCategory(path, history);
  }

  return (
    <div className={j(className, s.CategoryItem)} onClick={onClick}>
      <div
        className={cn({ [s.BgImage]: true })}
        style={{ backgroundImage: `url(${wrapImageUrl})` }}
      />
      <Text
        text={title}
        lines={2}
        className={cn({ [s.Title]: true })}
        hoverable
        color="white"
        size="xxxl"
        thin
      />
    </div>
  );
};

export default withRouter(ChannelListItem);
