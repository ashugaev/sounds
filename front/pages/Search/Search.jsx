import React from 'react';
import { inject, observer } from 'mobx-react';
import { throttle } from 'lodash-es';
import TracksList from 'c/ItemsBlock';
import { tracksType, searchQuery } from 'helpers/constants';
import query from 'query';

const Search = inject('pageStore', 'searchStore', 'pageStore')(observer(({
  className,
  pageStore,
  history,
  searchStore,
}) => {
  const {
    firstFetchPageTracks,
  } = pageStore;
  const { setSearch } = searchStore;

  const searchQueryVal = query.get(history, searchQuery);

  const throttledFetch = React.useCallback(throttle((value) => {
    firstFetchPageTracks({
      searchStr: value,
    });
  }, 500), []);

  React.useEffect(() => {
    return () => {
      setSearch(history, '');
    };
  }, []);

  React.useEffect(() => {
    throttledFetch(searchQueryVal);
  }, [searchQueryVal]);

  return (
    <div className={className}>
      {searchQueryVal && searchQueryVal.length && (
        <TracksList
          type={tracksType}
          title="Search Results"
          titlePlaceholder
        />
      )}
    </div>
  );
}));

export default Search;
