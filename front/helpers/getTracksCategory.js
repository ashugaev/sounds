import { categoriesPath } from 'constants';

export function getTracksCategory(pathname) {
  if (pathname.includes(categoriesPath)) {
    return pathname.match(/\/(\w+)$/)[1];
  }
}
