import React, { Component } from 'react';


export function HashTag(props) {
  const url = '/tags/' + props.decoratedText.replace(/^\#/, '');
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
  return <img src={"image.jpg"} />
}
