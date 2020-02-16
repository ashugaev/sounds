import React, { useState, useEffect } from 'react';
import { cn } from '@bem-react/classname';
import { inject, observer } from 'mobx-react';
import Button from 'c/Button';
import Icon from 'c/Icon';
import { withRouter } from 'react-router';
import './TagsMenu.sass';

const cnTagsMenu = cn('TagsMenu');

const TagsMenu = inject('tagsStore', 'tracksStore')(observer(({ tagsStore, tracksStore, history }) => {
  const [isOpened, setIsOpened] = useState(false);

  const { fetchTagsByIds, pushToAllTags, allTags } = tagsStore;
  const { setFilterTags, filterTags } = tracksStore;

  useEffect(() => {
    fetchTagsByIds(null, pushToAllTags);
  }, []);

  function toggleIsOpened() {
    setIsOpened(!isOpened);
  }

  function onTagClick(ids) {
    setFilterTags(ids, history);
    toggleIsOpened();
  }

  return (
    <div className={cnTagsMenu({ isOpened })}>
      <div className={cnTagsMenu('Background')} onClick={toggleIsOpened} />
      <div className={cnTagsMenu('Sideblock')}>
        {allTags.map((tag, i) => (
          <Button
            onClickArgs={tag._id}
            onClick={onTagClick}
            key={i}
            theme={filterTags.includes(tag._id) ? 'activeLabel' : 'label'}
            text={tag.name}
          />
        ))}

        <div className={cnTagsMenu('ToggleButton')} onClick={toggleIsOpened}>
          <Icon icon="hash" className={cnTagsMenu('Hash')} />
        </div>
      </div>
    </div>
  );
}));

export default withRouter(TagsMenu);
