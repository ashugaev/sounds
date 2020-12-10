import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash-es';
import ItemsBlock from 'c/ItemsBlock';
import PageTracksList from 'c/PageTracksList';

const OneCategory = inject('pageStore', 'categoriesStore', 'pageStore')(observer(({
  className,
  pageStore,
  match,
  categoriesStore,
}) => {
  const categoryName = get(match, 'params.name');
  const {
    currentCategory, fetchCurrentCategory, clearCurrentCategory,
  } = categoriesStore;
  const {
    firstFetchPageTracks,
  } = pageStore;

  useEffect(() => {
    fetchCurrentCategory(categoryName);
    firstFetchPageTracks({ filterCategory: categoryName });

    return () => clearCurrentCategory();
  }, []);

  return (
    <div className={className}>
      <ItemsBlock
        lazy
        title={get(currentCategory, 'title')}
      >
        <PageTracksList />
      </ItemsBlock>
    </div>
  );
}));

export default OneCategory;
