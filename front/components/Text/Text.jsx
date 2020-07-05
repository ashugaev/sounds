import React from 'react';
import { cn } from '@bem-react/classname';
import j from 'join';
import './Text.sass';

const cnText = cn('Text');

const Text = ({
  text, size, color, children, className, line, bold, cropLine, lines, hoverable,
}) => {
  const style = {};

  if (lines) style.WebkitLineClamp = lines;

  return (
    <span
      className={j(cnText({
        size, color, line, bold, cropLine, limitedLines: Boolean(lines), hoverable,
      }), className)}

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
