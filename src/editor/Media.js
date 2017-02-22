import React from 'react';
import Instagram from 'react-instagram-embed';

export default function Media(props) {
  console.log('Media props', props);
  const { contentState } = props;
  const key = props.block.getEntityAt(0);
  const entity = contentState.getEntity(key);
  const data = entity.getData();
  const type = entity.getType();

  if (type === 'PHOTO')
    return (
      <img alt={data.src} src={data.src} />
    );
  if (type === 'YOUTUBE')
    return (
      <iframe
        src={data.src}
        frameBorder="0"
        allowFullScreen />
    );
  if (type === 'INSTAGRAM') {
    return (
      <Instagram
        url={data.src}
      />
    )
  }
}
