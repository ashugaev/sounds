import React from 'react';
import query from 'query';
import j from 'join';
import { inject, observer } from 'mobx-react';
import Text from 'c/Text';
import { withRouter } from 'react-router';
import { albumsPath } from 'helpers/constants';
import TagButton from 'c/TagButton/TagButton';
import s from './ChannelListItem.sass';

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
  categories,
}) => {
  if (!title) return null;

  const { getCategoriesById } = categoriesStore;
  const channelCategories = getCategoriesById(categories);

  function onClick() {
    history.push({
      pathname: `${albumsPath}/${id}`,
      search: query.getString(history),
    });
  }

  return (
    <div className={j(className, s.ChannelListItem)} onClick={onClick}>
      <div className={s.BgImage} style={{ backgroundImage: `url(${wrapImageUrl})` }}>
        <div className={s.LogoImage} style={{ backgroundImage: `url(${logoImageUrl})` }} />
      </div>
      {channelCategories && (
      <div className={s.TagsBox}>
        {channelCategories.map((category, i) => (
          <TagButton
            id={category._id}
            key={i}
            text={category.name}
            theme="miniLabel"
            className={s.Tag}
            categoryPath={category.path}
          />
        ))}
      </div>
      )}
      {/* <div className={s.Counters}> */}
      {/*  {subscriberCount > 0 */}
      {/*    && <ChannelCounter className={s.OneCounter} text={subscriberCount} icon="person" />} */}
      {/*  {viewCount > 0 && <ChannelCounter className={s.OneCounter} text={viewCount} icon="eye" />} */}
      {/* </div> */}
      <Text size="s" text={title} lines={2} className={s.Title} hoverable />
    </div>
  );
}));

export default withRouter(ChannelListItem);
