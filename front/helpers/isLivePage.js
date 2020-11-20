import get from 'lodash-es/get';
import { livePath } from 'helpers/constants';

export const isLivePage = history => get(history, 'location.pathname') === livePath;
