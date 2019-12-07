import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class TagsStore {
  @observable allTags = []

  @observable allTagsPage = 0

  // Теги для отдельных треков
  @observable tagsBuffer = []

  @action.bound fetchTagsByIds(ids, callback) {
    axious.get('/api/tags/', {
      params: {
        ids: (ids && ids.toJS) ? ids.toJS() : ids,
      },
    })
      .then(({ data }) => runInAction(() => {
        this.tagsBuffer.push(...data);
        callback && callback(data);
      }))
      .catch((err) => {
        console.log(err);
      });
  }

  @action.bound pushToAllTags(tags) {
    this.allTags.push(...tags);
  }
}

export default new TagsStore();
