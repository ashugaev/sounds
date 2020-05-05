import React from 'react';
import query from 'query';
import j from 'join';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Text from 'c/Text';
import './ChannelListItem.sass';
import ChannelCounter from 'c/ChannelCounter';
import { withRouter } from 'react-router';

const cnChannelListItem = cn('ChannelListItem');

const ChannelListItem = inject('playerStore', 'tracksStore', 'pageStore')(observer(({
  history,
  id,
  className,
  title,
  logoImageUrl,
  wrapImageUrl,
  subscriberCount,
  viewCount,
}) => {
  if (!title) return null;

  function onClick() {
    history.push({
      pathname: `/channel/${id}`,
      search: query.getString(history),
    });
  }

  return (
    <div className={j(className, cnChannelListItem())} onClick={onClick}>
      <div className={cnChannelListItem('BgImage')} style={{ backgroundImage: `url(${wrapImageUrl})` }}>
        <div className={cnChannelListItem('LogoImage')} style={{ backgroundImage: `url(${logoImageUrl})` }} />
      </div>
      <div className={cnChannelListItem('Counters')}>
        {subscriberCount > 0
          && <ChannelCounter className={cnChannelListItem('OneCounter')} text={subscriberCount} icon="person" />}
        {viewCount > 0 && <ChannelCounter className={cnChannelListItem('OneCounter')} text={viewCount} icon="eye" />}
      </div>
      <Text size="s" text={title} lines={2} className={cnChannelListItem('Title')} hoverable />
    </div>
  );
}));

export default withRouter(ChannelListItem);
