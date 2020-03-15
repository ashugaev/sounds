import React from 'react';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import './TracksListItem.sass';

const cnTracksList = cn('TracksListItem');

const TracksListItem = inject()(observer(({ imageUrl, title }) => {
  return (
    <div className={cnTracksList()}>
      <div className={cnTracksList('ImageBg')} style={{ backgroundImage: `url(${imageUrl})` }} />
      <div className={cnTracksList('Image')} style={{ backgroundImage: `url(${imageUrl})` }} />
    </div>
  );
}));

export default TracksListItem;
