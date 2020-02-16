import React from 'react';
import { cn } from '@bem-react/classname';
import './Text.sass';

const cnText = cn('Text');

const Text = ({
  text, size, color, children, className,
}) => (
  <span
    className={`${cnText({ size, color })} ${className || ''}`}
  >
    {text || children}
  </span>
);

export default Text;
