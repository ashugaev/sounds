import React from 'react';
import { cn } from '@bem-react/classname';
import j from 'join';
import './Text.sass';

const cnText = cn('Text');

const Text = ({
  children, className, text, lines, ...modifiers
}) => {
  const style = {};

  if (lines) style.WebkitLineClamp = lines;

  return (
    <span
      className={j(cnText({
        limitedLines: Boolean(lines), ...modifiers,
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
