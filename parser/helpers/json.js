const fs = require('fs');

/**
 * Пишет данные в JSON
 *
 * @param data
 * @param name
 * @killAfter - убивает процесс после записи
 */
function write({ data, name, killAfter }) {
  fs.writeFile(
    name || './data.json',
    JSON.stringify(data), 'utf8', () => (
      console.log('файл записан'),
      killAfter && process.exit()
    ),
  );
}

module.exports = {
  write,
};
