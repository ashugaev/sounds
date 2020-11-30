import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class CategoriesStore {
    @observable allCategories = [];

    @observable categoriesLoading = false;

    @observable noCategoriesToFetch = false;

    @observable currentCategory = {}

    /**
     * @param rewrite
     * @param callback - в него всегда пробрасывается первым аргументом результат фетча
     * @param callbackArgs
     * @param catogoryName
     */
    @action.bound fetchCategories({
      rewrite, callback, callbackArgs, categoryName,
    }) {
      this.noCategoriesToFetch = false;
      this.currentCategory = {};
      this.categoriesLoading = true;

      axious.get('/api/categories/', {
        params: { categoryName },
      })
        .then(({ data }) => runInAction(() => {
          if (!categoryName) {
            if (rewrite) {
              this.allCategories.replace(data);
            } else {
              this.allCategories.push(...data);
            }
          }

          this.noCategoriesToFetch = true;

          callback && callback(data, callbackArgs);
        }))
        .catch((err) => {
          console.log(err);
        })
        .finally(() => runInAction(() => {
          this.categoriesLoading = false;
        }));
    }

    @action.bound setCurrentCategory(currentCategory) {
      this.currentCategory = currentCategory && currentCategory[0];
    }

    @action.bound fetchCurrentCategory(categoryName, callback) {
      this.fetchCategories({
        categoryName,
        callback: (currentCategory) => {
          this.setCurrentCategory(currentCategory);
          callback && callback(currentCategory[0]);
        },
      });
    }

    @action.bound
    clearCurrentCategory() {
      this.currentCategory = {};
    }

    getCategoriesByType(allCategories, types) {
      return allCategories.filter(category => types.includes(category.type));
    }

    @action.bound
    getCategoriesById(ids) {
      if (!ids || !ids.length) return;

      return this.allCategories.filter(category => ids.includes(category._id));
    }
}

export default new CategoriesStore();
