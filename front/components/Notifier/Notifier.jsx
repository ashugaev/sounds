import React from 'react';
import Button from 'c/Button';
import { inject, observer } from 'mobx-react';
import s from './Notifier.sass';

const Notifier = inject('notifierStore')(observer(({ notifierStore }) => {
  const { lastNotify, killLastNotify } = notifierStore;

  if (!lastNotify) return null;

  const { icon, text, callback } = lastNotify;

  return (
    <div className={s.Notifier}>
      <Button
        icon={icon}
        size="s"
        text={text}
        textColor="darkGray"
        className={cnNotifier('Play')}
        onClick={callback}
      />
      <Button icon="cross" size="s" onClick={killLastNotify} className={s.Cross} />
    </div>
  );
}));

export default Notifier;
