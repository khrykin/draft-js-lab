import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

import Button from './Button';

export default class AttachmentEditor extends Component {
  static defaultProps = {
    data: {},
    onChange: () => {},
    onClose: () => {}
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.href && nextProps.href !== this.state.href) {
      this.setState({ href: nextProps.href });
    }
  }

  close = e => {
    if (e.key === 'Enter') {
     this.props.onClose();
   }
  }

  render() {
    const { data } = this.props;

    return (
      <div
        ref={this.props.DOMNodeRef}
        className="absolute pa1 dt bg-black white shadow-4 white br2 z-index-3"
        style={this.props.style}>
        <div className="dtc">
          <a className="white" target="__blank" href={data.href}>{ data.filename }</a>
        </div>
        <div className="dtc w2">
        <Button
          className=""
          onClick={this.props.onRemove}>
          <i className="fa fa-close"/>
        </Button>
        </div>
      </div>
    )
  }
}
