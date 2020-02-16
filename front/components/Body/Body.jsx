import React from 'react';
import Notifier from 'c/Notifier';
import PlayerBox from 'c/PlayerBox';
import TagsMenu from 'c/TagsMenu';
import './Body.sass';

const Body = () => {
  return (
    <div className="Body">
      <Notifier />
      <PlayerBox className="Body-PlayerBox" />
      <TagsMenu />
    </div>
  );
};

export default Body;
