/**
 * Работа с query - параметрами
 */

import { get } from 'lodash-es';

const qs = require('query-string');

function set(history, name, val) {
  if (!history) return;

  const params = qs.parse(get(history, 'location.search'));

  params[name] = Array.isArray(val) ? [].concat(query).join() : val;

  history.push({
    search: `?${qs.stringify(params)}`,
  });
}

module.exports = { set };
