import React, { memo } from 'react';
import j from 'join';
import Input from 'c/Input';
import query from 'query';
import path from 'helpers/path';
import { withRouter } from 'react-router';
import { searchQuery, searchPath } from 'helpers/constants';

import { inject, observer } from 'mobx-react';
import s from './Search.sass';

const Search = inject('searchStore')(observer(({
  className, history, searchStore,
}) => {
  const { searchStr, setSearch, setSearchInput } = searchStore;
  const { pathname } = history.location;

  React.useEffect(() => {
    const value = query.getOne(history, searchQuery);

    setSearchInput(value);
  }, []);

  const onChange = (e) => {
    const { value } = e.target;

    setSearch(history, value);

    if (pathname !== searchPath) {
      path.set(history, searchPath);
    }
  };

  return (
    <Input
      value={searchStr}
      onChange={onChange}
      className={j(className, s.Search)}
      icon="search"
      placeholder="Search"
    />
  );
}));

export default withRouter(memo(Search));
