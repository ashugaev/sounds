import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import ItemsBlock from 'c/ItemsBlock';
import { genresType, soundsType } from 'helpers/constants';
import Loader from 'c/Loader';

const Categories = inject('categoriesStore')(observer(({
  className,
  categoriesStore,
}) => {
  const {
    fetchCategories,
    categoriesLoading,
  } = categoriesStore;

  useEffect(() => {
    fetchCategories({ rewrite: true });
  }, []);

  if (categoriesLoading) {
    return <Loader />;
  }

  return (
    <div className={className}>
      <ItemsBlock
        title="Mixes And Genres"
        type={genresType}
      />

      <ItemsBlock
        title="Nature Sounds"
        type={soundsType}
      />
    </div>
  );
}));

export default Categories;
