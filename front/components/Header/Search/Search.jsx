import React from 'react';
import j from 'join';
import Input from 'c/Input';
import query from 'query';
import path from 'helpers/path';
import { withRouter } from 'react-router';
import { searchQuery, searchPath } from 'helpers/constants';

import s from './Search.sass';

let isNotSearchPage = true;

const Search = ({
  className, history,
}) => {
  const [inputValue, setInputValue] = React.useState();

  const { pathname } = history.location;

  React.useEffect(() => {
    const value = query.getOne(history, searchQuery);

    if (value) {
      setInputValue(value);
    }
  }, []);

  React.useEffect(() => {
    if (pathname !== searchPath) {
      isNotSearchPage = true;
    }
  }, [pathname]);

  const onChange = (e) => {
    const { value } = e.target;

    setInputValue(value);

    query.set(history, searchQuery, value);

    if (isNotSearchPage) {
      path.set(history, searchPath);
      isNotSearchPage = false;
    }
  };

  return (
    <Input
      value={inputValue}
      onChange={onChange}
      className={j(className, s.Search)}
      icon="search"
      placeholder="Search"
    />
  );
};

export default withRouter(Search);
