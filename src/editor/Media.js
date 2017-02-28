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





  render() {
    const { data, type, focused } = this.props;

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
          onChange={this.props.onChange}>
          <img alt={data.src} src={data.src} />
        </MediaEditor>
      );

    if (type === 'YOUTUBE')
      return (
        <MediaEditor
          focused={focused}
          data={data}
          onChange={this.props.onChange}>
          <iframe
            src={data.src}
            frameBorder="0"
            allowFullScreen />
        </MediaEditor>
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

class MediaEditor extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.state.showURL && !nextProps.focused) {
      this.setState({ showURL: false });
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
    const { data } = this.props;
    return (
      <div className="relative dib">
        <Toolbar>
          <Button
            onClick={this.toggleShowURL}
            >
            URL
          </Button>
          { (this.state.showURL) && (
            <input
              type="text"
              value={data.src}
              onKeyPress={this.handleKeyPress}
              onChange={this.onFieldChange('src')}
              />
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
