import query from 'helpers/query';

export function setCategory(path, history) {
  if (!path) return;

  history.push({
    pathname: `/categories/${path}`,
    search: query.getString(history),
  });
}
