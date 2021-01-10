import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import j from 'join';
import ItemsBlock from 'c/ItemsBlock';
import get from 'lodash-es/get';
import ChannelListItem from 'c/ChannelListItem';
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

  const { fetchChannels, allChannels } = channelsStore;
  const { fetchCategories } = categoriesStore;

  return (
    <div className={j(className, s.ChannelsPage)}>
      <ItemsBlock>
        {allChannels.map(({
          brandingSettings, snippet, id, _id, bgImage,
        }) => (
          <ChannelListItem
            key={_id}
            id={id}
            title={get(snippet, 'title')}
            logoImageUrl={get(snippet, 'thumbnails.default.url')}
            wrapImageUrl={bgImage || get(brandingSettings, 'image.bannerMobileImageUrl')}
          />
        ))}
      </ItemsBlock>
    </div>
  );
}));

export default Channels;
