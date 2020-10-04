import React from 'react';
import get from 'lodash-es/get';
import Text from 'c/Text';
import Loader from 'c/Loader';
import LazyLoader from 'c/LazyLoader';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Items from 'c/ItemsBlock/Items';
import { tracksType } from 'helpers/constants';

import './ItemsBlock.sass';

const cnItemsBlock = cn('ItemsBlock');

const ItemsBlock = inject('pageStore', 'channelsStore')(observer(({
  pageStore, type, title, liveOnly, channelsStore, titlePlaceholder,
}) => {
  const {
    isLoading, noTracksToFetch, fetch: pageFetch,
  } = pageStore;
  const { noChannelsToFetch } = channelsStore;

  function loadMoreItems() {
    pageFetch({
      afterObjId: get(pageStore, 'lastTrack._id'),
      liveOnly,
    });
  }

  return (
    <>
      {type === tracksType && (
        <LazyLoader
          loadHandler={loadMoreItems}
          pixelsLeftToLoad={600}
          skipLoads={isLoading || noTracksToFetch}
        />
      )}
      <div className={cnItemsBlock()}>
        {(title || titlePlaceholder) ? (
          <Text
            text={title || '...'}
            size="xl"
            className={cnItemsBlock('Title')}
            line="normal"
            bold
            cropLine
          />
        ) : <div className={cnItemsBlock('UpperPlaceholder')} />}
        <div className={cnItemsBlock('List')}>
          <Items type={type} />
        </div>
      </div>
      {((!noTracksToFetch && type === tracksType) || (!noChannelsToFetch && type === 'channels'))
        ? <Loader />
        : <div className={cnItemsBlock('BottomPlaceholder')} />}
    </>
  );
}));

export default ItemsBlock;
