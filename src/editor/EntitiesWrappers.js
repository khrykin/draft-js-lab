import React, { Component } from 'react';


export function HashTag(props) {
  const url = '/tags/' + props.decoratedText.replace(/^#/, '');
  return (
    <a href={url}>
      { props.children }
    </a>
  );
};


export function Link(props) {
  // const entity = Entity.get(props.entityKey);
  // const { href, target } = entity.getData();
  return (
    <a href={"href"} target={"target"}>
      { props.children }
    </a>
  );
};

export function URLLink(props) {
  return (
    <a href={props.decoratedText}>
      { props.children }
    </a>
  );
}

export function Image(props) {
  // const entity = Entity.get(props.entityKey);
  // const { src } = entity.getData();
  return <img alt="{src}" src={"image.jpg"} />
}

const fileInfoStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0
};

const attachmentStyle = {
  position: 'relative'
};

export function Attachment({ children, ...props }) {
  const { entityKey, contentState } = props;
  const entity = contentState.getEntity(entityKey);
  const data = entity.getData();
  if (!data.href) {
    return (
      <span className="Attachment-loading">
        { typeof data.progress !== 'undefined' && (
          <strong className="Attachment-loading--info f6">
            { data.progress } %
          </strong>
        )}
        <a className={ data.progress ? "Attachment-loading-blinker" : ''} href="">
        { children }
        </a>
      </span>
    );
  }
  return (
    <a href="">
      { children }
    </a>
  );
}
