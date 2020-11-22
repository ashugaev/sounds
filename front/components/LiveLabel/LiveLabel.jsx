import React from 'react';
import Text from 'c/Text';
import cn from 'classnames';
import s from './LiveLabel.sass';

const LiveLabel = ({ className, withBg, withDot }) => {
  const liveLabelCN = cn(s.Live, className, {
    [s.Live_withBg]: withBg,
  });

  const liveContentCN = cn(s.Content, {
    [s.Content_withDot]: withDot,
  });

  return (
    <div className={liveLabelCN}>
      <Text className={liveContentCN} color="white">Live</Text>
    </div>
  );
};

export default LiveLabel;
