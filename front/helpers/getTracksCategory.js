import { categoriesPath } from 'helpers/constants';

export function getTracksCategory(pathname) {
  if (pathname.includes(categoriesPath)) {
    return pathname.match(/\/(\w+)$/)[1];
  }
}
