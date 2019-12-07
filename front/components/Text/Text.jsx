import React from 'react';
import { cn } from '@bem-react/classname';
import './Text.sass';

const cnText = cn('Text');

const Text = ({
  text, size, color, children,
}) => (
  <span
    className={cnText({ size, color })}
  >
    {text || children}
  </span>
);

export default Text;
