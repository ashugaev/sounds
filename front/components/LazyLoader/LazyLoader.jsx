import { useEffect } from 'react';
import { debounce } from 'lodash-es';

/**
 Вызывает метод loadHandler, когда осталось pixelsLeftToLoad пикселей до конца скролла
 Сейчас будет дублировать листерены, если добавить на одну страницу два раза.
 */
const LazyLoader = ({
  pixelsLeftToLoad, loadHandler, handlerArguments, skipLoads,
}) => {
  useEffect(() => {
    const debouncedScrollHandler = debounce(handleScroll, 100);

    document.addEventListener('scroll', debouncedScrollHandler);

    return () => {
      document.removeEventListener('scroll', debouncedScrollHandler);
    };
  }, []);

  function handleScroll() {
    const { scrollY, innerHeight } = window;
    const { clientHeight } = document.body;

    const toEndScroll = clientHeight - scrollY - innerHeight;

    if (toEndScroll < pixelsLeftToLoad && !skipLoads) loadHandler(handlerArguments);
  }

  LazyLoader.defaultProps = {
    pixelsLeftToLoad: 300,
  };

  return null;
};


export default LazyLoader;
