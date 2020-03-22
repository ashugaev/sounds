import React from 'react';
import { inject, observer } from 'mobx-react';
import Button from 'c/Button';
import { withRouter } from 'react-router';
import { setTagToLocalStorage } from '../../helpers/lastTrackNotifier';

const TagsButton = inject('tracksStore')(observer(({
  tracksStore, history, key, onClick, text, id, theme, className,
}) => {
  const {
    filterTags,
    setFilterTags,
    removeFilterTags,
  } = tracksStore;

  const isTagActive = filterTags.includes(id);

  function onTagClick() {
    isTagActive ? removeFilterTags(history) : setFilterTags(id, history);

    setTagToLocalStorage(text, id, isTagActive);
    onClick && onClick();
  }

  return (
    <Button
      onClick={onTagClick}
      key={key}
      isActive={isTagActive}
      theme={theme}
      text={text}
      className={className}
    />
  );
}));

TagsButton.defaultProps = {
  theme: 'label',
};

export default withRouter(TagsButton);
