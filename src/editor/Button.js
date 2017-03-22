import React, { Component } from 'react';

export default function Button({
  onClick,
  children,
  className,
  active
}) {
  return (
    <div
      className={
        `pointer dib pa1 br1 ph2 ma1 ` +
        (active ?
          `bg-white hover-bg-gray black` :
          `bg-transparent hover-bg-gray hover-white`
        ) +
        `${className ? ' ' + className : ''}`
      }
      onClick={onClick}>
      { children }
    </div>
  );
}



export class UploadButton extends Component {
  static defaultProps = {
    onChange() {},
    onClick() {}
  }

  delegateUpload = e => {
    e.preventDefault();
    console.log('BUTTON CLICKED');
    this.props.onClick();
    this.fileInput.click();
  }

  onUpload = e => {
    console.log('UPLOAD CHECKED');
    const { files } = e.target;
    this.props.onChange(files);
  }

  render() {
    const { children, onClick, ...props } = this.props;
    return (
      <span>
        <Button
          {...props}
          onClick={this.delegateUpload}>
          { children }
        </Button>
        <input
          ref={n => this.fileInput = n}
          type="file"
          name={props.name}
          onChange={this.onUpload}
          style={{ display: 'none' }}
          />
      </span>
    );
  }
}
