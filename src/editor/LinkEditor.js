import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

import Button from './Button';

export default class LinkEditor extends Component {
  static defaultProps = {
    data: {},
    onChange: () => {},
    onClose: () => {}
  }

  state = {
    href: this.props.data.href || '',
    blank: this.props.data.target === '__blank',
  }


  /* This is neccessary while we switchbetween links, since editor is actually
   * always mounted
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.href && nextProps.data.href !== this.state.href) {
      this.setState({ href: nextProps.data.href });
    }
  }

  setHref = e => {
    const { value: href } = e.target;
    this.setState({ href }, () => {
      this.props.onChange({
        href,
        target: this.state.blank ? '__blank' : undefined
      });
    });
  }

  setBlank = e => {
    const { checked: blank } = e.target;
    this.setState({ blank }, () => {
      this.props.onChange({
        href: this.state.href,
        target: this.state.blank ? '__blank' : undefined
      });
    });
  }

  close = e => {
    if (e.key === 'Enter') {
     this.props.onClose();
   }
  }

  render() {
    return (
      <div
        ref={this.props.DOMNodeRef}
        className="absolute pa1 dt bg-black white shadow-4 white br2 z-index-3"
        style={this.props.style}>
        <div className="dtc">
          <input
            className="input-reset f5 w5 h-100 br1 bw0 pa2 mr1 bg-near-white black "
            tabIndex={0}
            type="text"
            ref={this.props.inputDOMNodeRef}
            onKeyPress={this.close}
            value={this.state.href}
            onChange={this.setHref}
            />
          <div className="pa2 f6">
            <input
              type="checkbox"
              checked={this.state.blank}
              onChange={this.setBlank}
              />
            {' '}
            В отдельном окне
          </div>
        </div>
        <div className="dtc w2">
        <Button
          className=""
          onClick={this.props.removeLink}>
          <i className="fa fa-close"/>
        </Button>
        </div>
      </div>
    )
  }
}
