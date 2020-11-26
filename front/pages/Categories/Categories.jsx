import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import ItemsBlock from 'c/ItemsBlock';
import { genresType } from 'helpers/constants';

const Categories = inject('categoriesStore')(observer(({
  className,
  categoriesStore,
}) => {
  const {
    fetchCategories,
  } = categoriesStore;

  useEffect(() => {
    fetchCategories({ rewrite: true });
  }, []);

  return (
    <div className={className}>
      <ItemsBlock
        title="Mixes And Genres"
        type={genresType}
      />
    </div>
  );
}));

export default Categories;
