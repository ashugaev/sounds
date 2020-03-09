import React, { useState, useEffect } from 'react';
import { cn } from '@bem-react/classname';
import { inject, observer } from 'mobx-react';
import Button from 'c/Button';
import TagButton from 'c/TagButton';
import { withRouter } from 'react-router';
import './TagsMenu.sass';

const cnTagsMenu = cn('TagsMenu');

const TagsMenu = inject('tagsStore', 'tracksStore')(observer(({ tagsStore }) => {
  const [isOpened, setIsOpened] = useState(false);

  const { fetchTagsByIds, pushToAllTags, allTags } = tagsStore;

  useEffect(() => {
    fetchTagsByIds(null, pushToAllTags);
  }, []);

  function toggleIsOpened() {
    setIsOpened(!isOpened);
  }

  return (
    <div className={cnTagsMenu({ isOpened })}>
      <div className={cnTagsMenu('Background')} onClick={toggleIsOpened} />
      <div className={cnTagsMenu('SideblockWrapper')}>
        <div className={cnTagsMenu('Sideblock')}>
          {allTags.map((tag, i) => (
            <TagButton
              onClick={toggleIsOpened}
              key={i}
              text={tag.name}
              id={tag._id}
            />
          ))}
        </div>
        <Button icon="hash" className={cnTagsMenu('ToggleButton')} onClick={toggleIsOpened} />
      </div>
    </div>
  );
}));

export default withRouter(TagsMenu);
