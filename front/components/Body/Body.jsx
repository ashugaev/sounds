import React from 'react';
import Notifier from 'c/Notifier';
import { cn } from '@bem-react/classname';
import PlayerBox from 'c/PlayerBox';
import TagsMenu from 'c/TagsMenu';
import './Body.sass';

const cnBody = cn('Body');

const Body = () => {
  return (
    <div className={cnBody()}>
      <Notifier />
      <div className={cnBody('Content')}>
        <PlayerBox className={cnBody('PlayerBox')} />
      </div>
      <TagsMenu />
    </div>
  );
};

export default Body;
