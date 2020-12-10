import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';
import { categoryBlocksPath } from '../constants';

class CategoryBlocksStore {
    @observable categoryBlocks = [];

    @observable categoryBlocksIsLoading = false;

    @observable noCategoryBlocksToFetch = false;

    @action.bound
    fetchCategoryBlocks({
      callback, callbackArgs,
    } = {}) {
      return new Promise((rs, rj) => {
        if (this.noCategoriesToFetch) return;

        runInAction(() => {
          this.categoryBlocksIsLoading = true;
        });

        axious.get(categoryBlocksPath)
          .then(({ data }) => runInAction(() => {
            this.categoryBlocks.push(...data);

            this.noCategoriesToFetch = true;

            callback && callback(data, callbackArgs);
          }))
          .catch((err) => {
            console.log(err);
            rj();
          })
          .finally(() => runInAction(() => {
            this.categoryBlocksIsLoading = false;

            rs(this.categoryBlocks);
          }));
      });
    }
}

export default new CategoryBlocksStore();
