import React from 'react';
import { cn } from '@bem-react/classname';
import './Loader.sass';

const cnLoader = cn('Loader');

const Loader = () => {
  return (
    <div className={cnLoader()}>
      <svg className={cnLoader('Circular')}>
        <circle className={cnLoader('Path')} fill="none" r="20" cx="50" cy="50" strokeWidth="3" strokeMiterlimit="10" />
      </svg>
    </div>
  );
};

export default Loader;
