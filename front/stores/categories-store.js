import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class CategoriesStore {
    @observable allCategories = [];

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
        });
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
}

export default new CategoriesStore();
