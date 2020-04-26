import React, { useState, useEffect } from 'react';
import { cn } from '@bem-react/classname';
import { inject, observer } from 'mobx-react';
import Button from 'c/Button';
import TagButton from 'c/TagButton';
import { withRouter } from 'react-router';
import './TagsMenu.sass';

const cnTagsMenu = cn('TagsMenu');

const TagsMenu = inject('tagsStore', 'channelsStore', 'pageStore')(observer(({
  tagsStore, channelsStore, pageStore, history,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const { fetchTagsByIds, pushToAllTags, allTags } = tagsStore;
  const { fetchChannels, allChannels } = channelsStore;
  const { setFilterChannel } = pageStore;

  useEffect(() => {
    fetchTagsByIds(null, pushToAllTags);
    fetchChannels();
  }, []);

  function toggleIsOpened() {
    setIsOpened(!isOpened);
  }

  return (
    <div className={cnTagsMenu({ isOpened })}>
      <div className={cnTagsMenu('Background')} onClick={toggleIsOpened} />
      <div className={cnTagsMenu('SideblockWrapper')}>
        <div className={cnTagsMenu('Sideblock')}>
          {/* allTags.map((tag, i) => (
            <TagButton
              onClick={toggleIsOpened}
              key={i}
              text={tag.name}
              id={tag._id}
            />
          )) */}

          <br /><br />

          {allChannels.map(({ channelTitle, channelId }, i) => (
            <Button
              onClick={() => {
                toggleIsOpened();
                setFilterChannel(channelId, history);
              }}
              key={i}
              theme="miniLabel"
              text={channelTitle}
              className={cnTagsMenu('ChannelButton')}
            />
          ))}

        </div>
        <Button icon="hash" className={cnTagsMenu('ToggleButton')} onClick={toggleIsOpened} />
      </div>
    </div>
  );
}));

export default withRouter(TagsMenu);
