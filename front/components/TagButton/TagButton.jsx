import React from 'react';
import Button from 'c/Button';
import { withRouter } from 'react-router';
import { setCategory } from 'helpers/setCategory';

const TagsButton = ({
  history, key, onClick, text, theme, className, outlined, categoryPath, disableClick,
}) => {
  function onTagClick(_, e) {
    if (disableClick) return;

    setCategory(categoryPath, history);
    e.stopPropagation();

    onClick && onClick();
  }

  return (
    <Button
      onClick={onTagClick}
      key={key}
      theme={theme}
      text={text}
      className={className}
      outlined={outlined}
    />
  );
};

TagsButton.defaultProps = {
  theme: 'label',
};

export default withRouter(TagsButton);
