/**
 * Собирает строи из аргументов выбрасываю undefined (нужно для класснеймов)
 */
module.exports = function j(...args) {
  const result = [];


  for (let i = 0, l = args.length; i < l; i++) {
    const el = args[i];

    if (el) result.push(el);
  }

  return result.join(' ');
};
