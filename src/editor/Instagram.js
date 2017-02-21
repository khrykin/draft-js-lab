import React, { Component }  from 'react';
import { renderToStaticMarkup } from 'react-dom/server';


const style = {
  "background": "rgb(255, 255, 255)",
  "border": "0px",
  "margin": "1px",
  "maxWidth": "658px",
  "width": "calc(100% - 2px)",
  "borderRadius": "4px",
  "boxShadow": "rgba(0, 0, 0, 0.498039) 0px 0px 1px 0px, rgba(0, 0, 0, 0.14902) 0px 1px 10px 0px",
  "display": "block",
  "padding": "0px",
  position: 'absolute',
};


class Instagram extends Component {

  render() {
    const { src } = this.props;
    return (
      <iframe
        ref={n => this.el = n}
        className="instagram-media instagram-media-rendered"
        id="instagram-embed-0"
        src={`${src}/embed/captioned/?v=7`}
        allowTransparency
        frameBorder="0"
        height="460"
        sandbox="allow-scripts"
        data-instgrm
        data-instgrm-payload-id="instagram-media-payload-0"
        scrolling="no"
        style={style}
        />
    );
  }
}

Instagram.asString = src => renderToStaticMarkup(<Instagram src={src} />);

export default Instagram;
