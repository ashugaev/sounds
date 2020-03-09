import React from 'react';
import Button from 'c/Button';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import './Notifier.sass';

const cnNotifier = cn('Notifier');

const Notifier = inject('notifierStore')(observer(({ notifierStore }) => {
  const { lastNotify, killLastNotify } = notifierStore;

  if (!lastNotify) return null;

  const { icon, text, callback } = lastNotify;

  return (
    <div className={cnNotifier()}>
      <Button
        icon={icon}
        size="s"
        text={text}
        textColor="darkGray"
        className={cnNotifier('Play')}
        onClick={callback}
      />
      <Button icon="cross" size="s" onClick={killLastNotify} className={cnNotifier('Cross')} />
    </div>
  );
}));

export default Notifier;
