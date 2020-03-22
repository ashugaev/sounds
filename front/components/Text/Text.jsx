import React from 'react';
import { cn } from '@bem-react/classname';
import j from 'join';
import './Text.sass';

const cnText = cn('Text');

const Text = ({
  text, size, color, children, className, line, bold, cropLine,
}) => (
  <span
    className={j(cnText({
      size, color, line, bold, cropLine,
    }), className)}
  >
    {text || children}
  </span>
);

Text.defaultProps = {
  line: 'normal',
};

export default Text;
