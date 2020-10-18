import React from 'react';
import j from 'join';
import Input from 'c/Input';
import s from './Search.sass';

const Search = ({
  className,
}) => {
  const [value, setValue] = React.useState();

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Input
      value={value}
      onChange={onChange}
      className={j(className, s.Search)}
      icon="search"
      placeholder="Search"
    />
  );
};

export default Search;
