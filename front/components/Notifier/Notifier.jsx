import React from 'react';
import Button from 'c/Button';
import { inject, observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import './Notifier.sass';

const cnNotifier = cn('Notifier');

const Notifier = inject('notifierStore')(observer(({ notifierStore }) => {
  const { lastElem } = notifierStore;

  console.log('lastElem', lastElem);

  if (!lastElem) return null;

  const { icon, text } = lastElem;

  function onCloseClick() {
    console.log('close');
  }

  return (
    <div className={cnNotifier()}>
      <Button
        icon={icon}
        size="s"
        text={text}
        textColor="darkGray"
        className={cnNotifier('Play')}
        onClick={() => console.log('playyy')}
      />
      <Button icon="cross" onClick={onCloseClick} className={cnNotifier('Cross')} />
    </div>
  );
}));

export default Notifier;
