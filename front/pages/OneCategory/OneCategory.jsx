import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash-es';
import TracksList from 'c/ItemsBlock';
import { tracksType } from 'helpers/constants';

const OneCategory = inject('pageStore', 'categoriesStore', 'pageStore')(observer(({
  className,
  pageStore,
  match,
  categoriesStore,
}) => {
  const categoryName = get(match, 'params.name');
  const {
    currentCategory, fetchCurrentCategory,
  } = categoriesStore;
  const {
    firstFetchPageTracks, resetTracks,
  } = pageStore;

  useEffect(() => {
    // Сброс треков, что бы они не висели пока отработывает fetchCurrentCategory
    resetTracks();

    fetchCurrentCategory(categoryName, (data) => {
      firstFetchPageTracks({
        channel: data.channels.join(),
      });
    });
  }, []);

  return (
    <div className={className}>
      <TracksList
        type={tracksType}
        title={get(currentCategory, 'name')}
        titlePlaceholder
      />
    </div>
  );
}));

export default OneCategory;
