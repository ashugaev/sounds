import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import j from 'join';
import TracksList from 'c/ItemsBlock';
import s from './Channels.sass';

const Channels = inject('channelsStore', 'categoriesStore')(observer(({
  className,
  channelsStore,
  categoriesStore,
}) => {
  useEffect(() => {
    fetchCategories({ rewrite: true });
    fetchChannels({ rewrite: true });
  }, []);

  const { fetchChannels } = channelsStore;
  const { fetchCategories } = categoriesStore;

  return (
    <div className={j(className, s.ChannelsPage)}>
      <TracksList type="channels" />
    </div>
  );
}));

export default Channels;
