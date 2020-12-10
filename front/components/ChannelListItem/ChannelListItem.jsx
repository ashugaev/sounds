import React, { useState } from 'react';
import query from 'query';
import j from 'join';
import { inject, observer } from 'mobx-react';
import Text from 'c/Text';
import { withRouter } from 'react-router';
import { albumsPath } from 'constants';
import TagButton from 'c/TagButton/TagButton';
import DotsMenu from 'c/DotsMenu';
import s from './ChannelListItem.sass';

/**
 * isDemo - включает режим демонстрации отключаа интерактивность
 */
const ChannelListItem = inject(
  'playerStore',
  'playerTracksStore',
  'pageStore',
  'categoriesStore',
)(observer(({
  history,
  id,
  className,
  title,
  logoImageUrl,
  wrapImageUrl,
  categoriesStore,
  categoriesIds,
  isDemo,
}) => {
  if (!title) return null;

  const [isHovered, setIsHovered] = useState(false);

  const { getCategoriesById } = categoriesStore;
  const channelCategories = getCategoriesById(categoriesIds);

  function onClick() {
    if (isDemo) return;

    history.push({
      pathname: `${albumsPath}/${id}`,
      search: query.getString(history),
    });
  }

  return (
    <div
      className={j(className, s.ChannelListItem)}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isDemo && (
        <DotsMenu
          isVisible={isHovered}
          channelCategories={channelCategories}
          channelCategoryIds={categoriesIds}
          channelData={{
            title,
            id,
            logoImageUrl,
            wrapImageUrl,
          }}
        />
      )}
      <div className={s.BgImage} style={{ backgroundImage: `url(${wrapImageUrl})` }}>
        <div className={s.LogoImage} style={{ backgroundImage: `url(${logoImageUrl})` }} />
      </div>
      {/* <div className={s.Counters}> */}
      {/*  {subscriberCount > 0 */}
      {/*    && <ChannelCounter className={s.OneCounter} text={subscriberCount} icon="person" />} */}
      {/*  {viewCount > 0 && <ChannelCounter className={s.OneCounter} text={viewCount} icon="eye" />} */}
      {/* </div> */}
      <Text size="s" text={title} lines={2} className={s.Title} hoverable />
      {channelCategories && (
        <div className={s.TagsBox}>
          {channelCategories.map((category, i) => (
            <TagButton
              disableClick={isDemo}
              id={category._id}
              key={i}
              text={category.title}
              theme="miniLabel"
              className={s.Tag}
              categoryPath={category.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}));

export default withRouter(ChannelListItem);
