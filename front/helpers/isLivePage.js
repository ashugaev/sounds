import get from 'lodash-es/get';
import { livePath } from 'constants';

export const isLivePage = history => get(history, 'location.pathname') === livePath;
