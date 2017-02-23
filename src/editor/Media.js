import React, { Component } from 'react';
import Instagram from 'react-instagram-embed';
import TableEditor, { CSVToHTML } from './TableEditor';
import Button from './Button';
export default class Media extends Component {
  static defaultProps = {
    onChange() {},
    onBlur() {},
    onFocus() {}
  };

  state = {};

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      console.log('SAVE');
      this.setState({ showURL: false }, () => {
        this.props.onBlur();
      });
    }
  }

  onFieldChange = name => e => {
    e.preventDefault();
    const { value } = e.target;
    this.props.onChange({ [name]: value });
  }

  toggleShowURL = e => {
    e.preventDefault();
    this.setState({ showURL: !this.state.showURL }, () => {
      if (this.state.showURL) {
        this.props.onFocus();
      }
    });
  }

  Figure = ({ children }) => {
    const { data } = this.props;
    return (
      <div className="relative dib">
        <Toolbar>
          <Button
            onClick={this.toggleShowURL}
            >
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
        </Toolbar>
        { children }
      </div>
    );
  }

  render() {
    const { data, type } = this.props;

    if (type === 'TABLE') {
      return (
        <span>
          <div dangerouslySetInnerHTML={{__html: CSVToHTML(data.content) }} />
          <a href="" onClick={this.props.onFocus}>Edit</a>
        </span>
      );
    }

    if (type === 'PHOTO')
      return (
        <this.Figure>
          <img alt={data.src} src={data.src} />
        </this.Figure>
      );

    if (type === 'YOUTUBE')
      return (
        <this.Figure>
          <iframe
            src={data.src}
            frameBorder="0"
            allowFullScreen />
        </this.Figure>
      );

    if (type === 'INSTAGRAM')
      return (
        <Instagram
          url={data.src}
        />
      );
  }
}

function Toolbar({ children }) {
  return (
    <div className="pa2 bg-black-30 white absolute w-100 tl">{ children }</div>
  );
}
