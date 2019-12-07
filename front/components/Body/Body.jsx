import React from 'react';
import PlayerBox from 'c/PlayerBox';
import TagsMenu from 'c/TagsMenu';
import './Body.sass';

const Body = () => {
  return (
    <div className="Body">
      <PlayerBox className="Body-PlayerBox" />
      <TagsMenu />
    </div>
  );
};

export default Body;
