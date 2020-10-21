import {
  observable, action,
} from 'mobx';
import query from 'helpers/query';
import { searchQuery } from 'helpers/constants';

class SearchStore {
  @observable searchStr;

  @action.bound
  setSearchInput(value) {
    this.searchStr = value;
  }

  @action.bound
  setSearchQuery(history, value) {
    query.set(history, searchQuery, value);
  }

  @action.bound
  setSearch(history, value) {
    this.setSearchInput(value);
    this.setSearchQuery(history, value);
  }
}

export default new SearchStore();
