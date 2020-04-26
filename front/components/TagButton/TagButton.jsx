import React from 'react';
import { inject, observer } from 'mobx-react';
import Button from 'c/Button';
import { withRouter } from 'react-router';
import { setTagToLocalStorage } from '../../helpers/lastTrackNotifier';

const TagsButton = inject('pageStore')(observer(({
  history, key, onClick, text, id, theme, className, pageStore,
}) => {
  const {
    filterTags,
    setFilterTags,
    removeFilterTags,
  } = pageStore;

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
