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
    setFilterChannel,
  } = pageStore;

  useEffect(() => {
    fetchCurrentCategory(categoryName, (data) => {
      setFilterChannel({
        resetBefore: true,
        id: data.channels.join(),
      });
    });
  }, []);

  return (
    <div className={className}>
      <TracksList type={tracksType} title={get(currentCategory, 'name')} />
    </div>
  );
}));

export default OneCategory;
