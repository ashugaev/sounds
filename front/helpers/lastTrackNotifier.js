function showLastTrackNotifier(createNotify, fetch) {
  const lastVideoObjId = localStorage.getItem('lastVideoObjId');
  const lastVideoName = localStorage.getItem('lastVideoName');
  const lastTagId = localStorage.getItem('lastTagId');
  const lastTagName = localStorage.getItem('lastTagName');

  let text;

  if (lastTagId && lastTagName) {
    text = `Продолжить слушать категорию ${lastTagName}`;
  } else if (lastVideoName && lastVideoName) {
    text = `Продолжить слушать трек ${lastVideoName}`;
  }

  if (!lastVideoObjId || !lastVideoName) return;

  createNotify({
    text,
    icon: 'play',
    callback() {
      fetch({
        rewirite: true, fromObjId: lastVideoObjId, tags: [lastTagId], checkPrevTracks: true,
      });
    },
  });
}

function setTagToLocalStorage(tagName, tagId, isActive) {
  if (!tagName || !tagId) return;

  if (isActive) {
    localStorage.removeItem('lastTagId');
    localStorage.removeItem('lastTagName');

    return;
  }

  localStorage.setItem('lastTagId', tagId);
  localStorage.setItem('lastTagName', tagName);
}

function setTrackToLocalStorage(trackName, trackId, trackObjId) {
  localStorage.setItem('lastVideoId', trackId);
  localStorage.setItem('lastVideoName', trackName);
  localStorage.setItem('lastVideoObjId', trackObjId);
}

module.exports = {
  showLastTrackNotifier,
  setTagToLocalStorage,
  setTrackToLocalStorage,
};
