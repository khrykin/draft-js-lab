import React, { Component } from 'react';

export default class HTMLEditor extends Component {

  static defaultProps = {
    onChange() {}
  }

  change = e => {
    const { value } = e.target;
    this.props.onChange(value);
  }

  render() {
    return (
        <textarea
          value={this.props.value}
          onChange={this.change} />
    );
  }
}
