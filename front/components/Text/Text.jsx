import React from 'react';
import cn from 'classnames';
import j from 'join';
import cnByModifiers from 'cnByModifiers';
import s from './Text.sass';

const Text = ({
  children, className, text, lines, line, color, size, bold, cropLine, hoverable,
}) => {
  const style = {};

  if (lines) style.WebkitLineClamp = lines;

  const modifiers = cnByModifiers({
    s,
    root: 'Text',
    mods: {
      size,
      color,
      line,
      bold,
      hoverable,
      cropLine,
    },
  });

  return (
    <span
      className={j(
        s.Text,
        cn({
          [s.Text_limitedLines]: Boolean(lines),
        }),
        ...modifiers,
        className,
      )}

      style={style}
    >
      {text || children}
    </span>
  );
};

Text.defaultProps = {
  line: 'normal',
};

export default React.memo(Text);
