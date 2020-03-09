function showLastTrackNotifier(createNotify, fetch) {
  const lastVideoId = localStorage.getItem('lastVideoId');
  const lastVideoName = localStorage.getItem('lastVideoName');
  const lastTagId = localStorage.getItem('lastTagId');
  const lastTagName = localStorage.getItem('lastTagName');

  let text;

  if (lastTagId && lastTagName) {
    text = `Продолжить слушать тег ${lastTagName}`;
  } else if (lastVideoName && lastVideoName) {
    text = `Продолжить слушать трек ${lastTagName}`;
  }

  if (!lastVideoId || !lastVideoName) return;

  createNotify({
    text,
    icon: 'play',
    callback() {
      fetch(true, lastVideoId, [lastTagId]);
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

function setTrackToLocalStorage(trackName, trackId) {
  localStorage.setItem('lastVideoId', trackId);
  localStorage.setItem('lastVideoName', trackName);
}

module.exports = {
  showLastTrackNotifier,
  setTagToLocalStorage,
  setTrackToLocalStorage,
};
