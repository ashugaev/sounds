import React from 'react';
import j from 'join';
import Input from 'c/Input';
import query from 'query';
import { withRouter } from 'react-router';
import { search } from 'helpers/constants';
import s from './Search.sass';

const Search = ({
  className, history,
}) => {
  const [inputValue, setInputValue] = React.useState();

  React.useEffect(() => {
    const value = query.getOne(history, search);

    if (value) {
      setInputValue(value);
    }
  }, []);

  const onChange = (e) => {
    const { value } = e.target;

    setInputValue(value);

    query.set(history, search, value);
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
