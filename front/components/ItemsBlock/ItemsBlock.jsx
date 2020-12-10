import React from 'react';
import get from 'lodash-es/get';
import Text from 'c/Text';
import Loader from 'c/Loader';
import LazyLoader from 'c/LazyLoader';
import { inject, observer } from 'mobx-react';
import s from './ItemsBlock.sass';

const ItemsBlock = inject('pageStore')(observer(({
  pageStore, title, lazy, children,
}) => {
  const {
    isTracksLoading, noTracksToFetch, fetchPageTracks,
  } = pageStore;
  function loadMoreItems() {
    fetchPageTracks({
      afterObjId: get(pageStore, 'lastTrack._id'),
    });
  }

  return (
    <>
      {lazy && (
        <LazyLoader
          loadHandler={loadMoreItems}
          pixelsLeftToLoad={600}
          skipLoads={isTracksLoading || noTracksToFetch}
        />
      )}
      <div className={s.ItemsBlock}>
        {title ? (
          <Text
            text={title}
            size="xl"
            className={s.Title}
            line="normal"
            bold
            cropLine
          />
        ) : (
          <div className={s.UpperPlaceholder} />
        )}
        <div className={s.List}>
          { children }
        </div>
      </div>
      {lazy ? (
        isTracksLoading ? <Loader /> : <div className={s.LoaderPlaceholder} />
      ) : (
        <div className={s.BottomPlaceholder} />
      )}
    </>
  );
}));

export default ItemsBlock;
