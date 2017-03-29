import React, { Component } from 'react';
import CodeEditor from './CodeEditor';

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

  change = value => {
    this.props.onChange({
      ...this.props.data,
      content: value
    });
  }

  render() {
    const { isEditing } = this.state;
    const { data } = this.props;
    return (
      <div className="realtive">
        { isEditing ? (
          <CodeEditor
            value={data.content}
            onChange={this.change}
            />
        ) : (
          <span dangerouslySetInnerHTML={{__html: data.content }} />
        )}
        <div style={{ display: isEditing ? 'none' : 'block' }}>
          <a href="" className="link dim gray"
            onClick={this.toggleIsEditing}>
            <i className="fa fa-pencil" />
          </a>
        </div>
      </div>
    );
  }
}
