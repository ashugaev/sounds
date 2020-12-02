import React from 'react';
import TracksListItem from 'c/TracksListItem';
import ChannelListItem from 'c/ChannelListItem';
import GenreItem from 'c/CategoryItem';
import get from 'lodash-es/get';
import { inject, observer } from 'mobx-react';
import { genresType, mixType, soundsType } from 'constants';


const Items = inject('playerTracksStore', 'channelsStore', 'categoriesStore', 'playerStore', 'pageStore')(observer(({
  categoriesStore, channelsStore, playerTracksStore, playerStore, pageStore, type,
}) => {
  let content = null;
  let categories = [];

  const { allChannels } = channelsStore;
  const { currentTrack } = playerTracksStore;
  const { allCategories, getCategoriesByType } = categoriesStore;
  const { isPlaying } = playerStore;
  const { tracks } = pageStore;

  switch (type) {
    case 'tracks':
      content = tracks.map(({ snippet, id, _id }) => (
        <TracksListItem
          key={_id}
          title={get(snippet, 'title')}
          imageUrl={get(snippet, 'thumbnails.high.url')}
          isPlaying={(id.videoId === get(currentTrack, 'id.videoId')) && isPlaying}
          videoObjId={_id}
          isLive={get(snippet, 'liveBroadcastContent') === 'live'}
        />
      ));
      break;

    case 'channels':
      content = allChannels.map(({
        brandingSettings, snippet, id, _id, bgImage, categories
      }) => (
        <ChannelListItem
          key={_id}
          id={id}
          title={get(snippet, 'title')}
          logoImageUrl={get(snippet, 'thumbnails.default.url')}
          wrapImageUrl={bgImage || get(brandingSettings, 'image.bannerMobileImageUrl')}
          categories={categories}
        />
      ));
      break;

    case genresType:
      // Пока что тип mix тут же
      categories = getCategoriesByType(allCategories, [genresType, mixType]);

      content = categories.map(({
        _id, name, bgImage, path,
      }) => (
        <GenreItem
          key={_id}
          wrapImageUrl={bgImage}
          title={name}
          path={path}
        />
      ));
      break;

    case soundsType:
      categories = getCategoriesByType(allCategories, [soundsType]);

      content = categories.map(({
        _id, name, bgImage, path,
      }) => (
        <GenreItem
          key={_id}
          wrapImageUrl={bgImage}
          title={name}
          path={path}
        />
      ));
      break;

    default:
      break;
  }

  return content;
}));

export default Items;
