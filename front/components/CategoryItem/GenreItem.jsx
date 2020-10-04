import React from 'react';
import query from 'query';
import j from 'join';
import { cn } from '@bem-react/classname';
import Text from 'c/Text';
import './GenreItem.sass';
import { withRouter } from 'react-router';

const cnChannelListItem = cn('CategoryItem');

const ChannelListItem = ({
  history,
  className,
  title,
  path,
  wrapImageUrl,
}) => {
  if (!title) return null;

  function onClick() {
    history.push({
      pathname: `/categories/${path}`,
      search: query.getString(history),
    });
  }

  return (
    <div className={j(className, cnChannelListItem())} onClick={onClick}>
      <div
        className={cnChannelListItem('BgImage')}
        style={{ backgroundImage: `url(${wrapImageUrl})` }}
      />
      <Text
        text={title}
        lines={2}
        className={cnChannelListItem('Title')}
        hoverable
        color="white"
        size="xxxl"
        thin
      />
    </div>
  );
};

export default withRouter(ChannelListItem);
