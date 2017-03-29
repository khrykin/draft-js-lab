import React, { Component } from 'react';
import Instagram from 'react-instagram-embed';
import TableEditor, { CSVToHTML } from './TableEditor';
import HTMLEditor from './HTMLEditor';
import Button, { UploadButton } from './Button';

function parseURL(url) {
  let parser = document.createElement('a');
  let params = {};
  // Let the browser do the work
  parser.href = url;
  // Convert query string to object
  let queries = parser.search.replace(/^\?/, '').split('&');
  for (let i = 0; i < queries.length; i++) {
    let split = queries[i].split('=');
    params[split[0]] = split[1];
  }

  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    params
  };
}

export function getYoutubeEmbedSrc(url) {
  const { params, hostname } = parseURL(url);
  const { v } = params;

  if (hostname !== 'youtube.com' && hostname !== 'www.youtube.com' || !v ) return url;
  return `http://www.youtube.com/embed/${v}`;
}

export default class Media extends Component {
  static defaultProps = {
    onChange() {},
    onBlur() {},
    onFocus() {},
    onUpload() {}
  };

  state = {};

  render() {
    const { data, type, focused } = this.props;

    if (type === 'HTML') {
      return (
        <HTMLEditor
          focused={focused}
          data={data}
          onChange={this.props.onChange}
          />
      );
    }

    if (type === 'TABLE') {
      return (
        <TableEditor
          focused={focused}
          data={data}
          onChange={this.props.onChange}
          />
      );
    }

    if (type === 'PHOTO')
      return (
        <MediaEditor
          focused={focused}
          data={data}
          upload
          onUpload={this.props.onUpload}
          onChange={this.props.onChange}>
          { data.src ? (
            <img className="" alt={data.src} src={data.src} />
          ) :  (
            <EmptyMedia>
              <i className="fa fa-photo" />
              { data.progress > 0 && (
                <span>{' '}{ data.progress } %</span>
              )}
            </EmptyMedia>
          )}
        </MediaEditor>
      );

    if (type === 'YOUTUBE')
      return (
        <MediaEditor
          focused={focused}
          data={data}
          onChange={this.props.onChange}>
          { data.src ? (
            <div className="Embed">
              <iframe
                src={getYoutubeEmbedSrc(data.src)}
                width="400"
                height="300"
                frameBorder="0"
                allowFullScreen />
            </div>
          ) : (
            <EmptyMedia>
              <i className="fa fa-video-camera" />
            </EmptyMedia>
          ) }
        </MediaEditor>
      );

    if (type === 'INSTAGRAM')
      return (
        <Instagram
          url={data.src}
        />
      );

    return <div>*** Undefined Media Type *** </div>
  }
}

function Toolbar({ children }) {
  return (
    <div className="pa2 child z99 bg-black-30 white absolute w-100 tl">{ children }</div>
  );
}

function EmptyMedia({ children }) {
  return (
    <div className="dt bg-light-gray h5 w-100 tc mb1 br2">
      <div className="dtc v-mid gray lh-copy f6">
        { children }
      </div>
    </div>
  );
}

export const DEFAULT_IMAGE = `image.jpg`;
export const LOADING_IMAGE = `image2.jpg`;

class MediaEditor extends Component {
  static defaultProps = {
    onUpload() { console.log('MediaEditor onUpload is undefined') }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.showURL && !nextProps.focused) {
      this.setState({ showURL: false });
    }
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.setState({ showURL: false });
      // this.props.onBlur();
    }
  }

  toggleShowURL = e => {
    e.preventDefault();
    this.setState({ showURL: !this.state.showURL });
  }

  onFieldChange = name => e => {
    e.preventDefault();
    const { value } = e.target;
    this.props.onChange({
      ...this.props.data,
      [name]: value
    });
  }

  state = {
    showURL: false
  }

  render() {
    const { data, upload } = this.props;
    return (
      <div className="relative hide-child">
        <Toolbar>
          <Button
            onClick={this.toggleShowURL}>
            URL
          </Button>
          { this.state.showURL && (
            <input
              type="text"
              value={data.src}
              onKeyPress={this.handleKeyPress}
              onChange={this.onFieldChange('src')}
              />
          )}
          { upload && (
            <span>
              <UploadButton
                onChange={this.props.onUpload}>
                Загрузить
              </UploadButton>
            </span>
          )}

        </Toolbar>
        { this.props.children }
      </div>
    );
  }
}

// class TableEditor extends Component {
//   render() {
//     return (
//       <div>Table Editor</div>
//     );
//   }
// }
