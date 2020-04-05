import React from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Text from 'c/Text';
import './TracksListItem.sass';

const cnTracksListItem = cn('TracksListItem');

const TracksListItem = inject()(observer(({ imageUrl, title, channelTitle }) => {
  return (
    <div className={cnTracksListItem()}>
      <div className={cnTracksListItem('Image')} style={{ backgroundImage: `url(${imageUrl})` }} />
      {/*<Text size="xs" text={channelTitle} cropLine className={cnTracksListItem('ChannelTitle')} />*/}
      <Text size="s" text={title} lines={2} className={cnTracksListItem('Title')} />
    </div>
  );
}));

export default TracksListItem;
