import query from 'query';

/**
 * Устанавливает path в урле
 */

function set(history, path) {
  const q = query.getString(history);

  history.push(`${path}${q}`);
}

export default {
  set,
};
