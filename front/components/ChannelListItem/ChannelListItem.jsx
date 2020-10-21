import React from 'react';
import query from 'query';
import j from 'join';
import { inject, observer } from 'mobx-react';
import Text from 'c/Text';
import ChannelCounter from 'c/ChannelCounter';
import { withRouter } from 'react-router';
import s from './ChannelListItem.sass';

const ChannelListItem = inject('playerStore', 'playerTracksStore', 'pageStore')(observer(({
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
    <div className={j(className, s.ChannelListItem)} onClick={onClick}>
      <div className={s.BgImage} style={{ backgroundImage: `url(${wrapImageUrl})` }}>
        <div className={s.LogoImage} style={{ backgroundImage: `url(${logoImageUrl})` }} />
      </div>
      <div className={s.Counters}>
        {subscriberCount > 0
          && <ChannelCounter className={s.OneCounter} text={subscriberCount} icon="person" />}
        {viewCount > 0 && <ChannelCounter className={s.OneCounter} text={viewCount} icon="eye" />}
      </div>
      <Text size="s" text={title} lines={2} className={s.Title} hoverable />
    </div>
  );
}));

export default withRouter(ChannelListItem);
