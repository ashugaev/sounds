import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import ItemsBlock from 'c/ItemsBlock';
import Loader from 'c/Loader';
import GenreItem from 'c/CategoryItem';

const Categories = inject('categoriesStore', 'categoryBlocksStore')(observer(({
  className,
  categoriesStore,
  categoryBlocksStore,
}) => {
  const {
    fetchCategories,
    categoriesLoading,
    getCategoriesByBlockId,
  } = categoriesStore;
  const {
    fetchCategoryBlocks,
    categoryBlocks,
  } = categoryBlocksStore;

  useEffect(() => {
    // Для ленивой загрузки в дальнейшем можно эту ф-цию перевызывать добавив параметр fromCategory для fetchCategoryBlocks
    (async () => {
      await fetchCategoryBlocks();

      const categoryBlockIds = categoryBlocks.map(el => el._id);

      // достанем айдишники
      await fetchCategories({ rewrite: true, categoryBlockIds });
    })();
  }, []);

  if (categoriesLoading) {
    return <Loader />;
  }

  return (
    <div className={className}>
      {categoryBlocks.map(({ _id, title }) => {
        const categories = getCategoriesByBlockId(_id);

        return (
          <ItemsBlock
            key={_id}
            title={title}
          >
            {categories.map(({
              _id: categoryId, name, bgImage, title: CategoryTitle,
            }) => (
              <GenreItem
                key={categoryId}
                wrapImageUrl={bgImage}
                title={CategoryTitle}
                name={name}
              />
            ))}
          </ItemsBlock>
        );
      })}
    </div>
  );
}));

export default Categories;
