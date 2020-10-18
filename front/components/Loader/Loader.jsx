import React from 'react';
import s from './Loader.sass';

const Loader = () => {
  return (
    <div className={s.Loader}>
      <svg className={s.Circular}>
        <circle className={s.Path} fill="none" r="20" cx="50" cy="50" strokeWidth="3" strokeMiterlimit="10" />
      </svg>
    </div>
  );
};

export default Loader;
