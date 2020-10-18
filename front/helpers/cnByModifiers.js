/**
 * Вытаскивает классы модификоторов из объекта в формате Сlassname_modName_modVal
 */

module.exports = function ({ s, root, mods }) {
  const vals = Object.values(mods);
  const keys = Object.keys(mods);

  return keys.map((mod, i) => {
    const val = vals[i];

    if (!val) {
      return;
    }

    if (val === true) {
      return s[`${root}_${mod}`];
    }

    return s[`${root}_${mod}_${val}`];
  });
};
