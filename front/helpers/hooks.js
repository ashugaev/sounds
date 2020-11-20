import query from 'helpers/query';
import { useEffect } from 'react';

export const useQueriesUpdate = ({
  history,
  filterChannel,
  filterTags,
}) => {
  // Handle query parameter playerChannel
  useEffect(() => {
    query.set(history, 'playerChannel', filterChannel);
  }, [filterChannel]);

  // Handle query parameter playerTags
  useEffect(() => {
    query.set(history, 'playerTags', filterTags);
  }, [filterTags]);
};
