import React, { Component } from 'react';

export default class HTMLEditor extends Component {

  static defaultProps = {
    onChange() {}
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isEditing && !nextProps.focused) {
      this.setState({ isEditing: false });
    }
  }

  toggleIsEditing = e => {
    e && e.preventDefault();
    this.setState({ isEditing: true });
  }


  state = {
    isEditing: false
  }

  change = e => {
    const { value } = e.target;
    this.props.onChange({
      ...this.props.data,
      content: value
    });
  }

  render() {
    const { isEditing } = this.state;
    const { data } = this.props;
    return (
      <div>
        { isEditing ? (
          <textarea
            className="dib code input-reset"
            value={data.content}
            onChange={this.change} />
        ) : (
          <span dangerouslySetInnerHTML={{__html: data.content }} />
        )}
        <div style={{ visibility: isEditing ? 'hidden' : 'visible' }}>
          <a href=""
            onClick={this.toggleIsEditing}>
            Edit
          </a>
        </div>
      </div>
    );
  }
}
