import React, { Component } from 'react';
import { removeBlock } from './utils';

import { Entity } from 'draft-js';

import Media from './Media';

export default class MediaBlockEditor extends Component {

  constructor(props) {
    super(props);
    const key = props.block.getEntityAt(0);
    const entity = Entity.get(key);
    const data = entity.getData();

    this.state = data;
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.save();
    }
  }

  setInputField = name => e => {
    const { value } = e.target;
    this.setState({ [name]: value });
  }

  setField = name => value => {
    this.setState({ [name]: value });
  }

  delete = e => {
    e.preventDefault();
    const { editor } = this.props.blockProps;
    editor.setState({ readOnly: false }, () => {

      const newEditorState = removeBlock(editor.state.editorState, this.props.block.key);

      editor.onChange(newEditorState);
    });
  }

  edit = e => {
    e.preventDefault();
    const { editor } = this.props.blockProps;
    this.setState({ edit: true }, () => {
      editor.setState({ readOnly: true });
    });
  }

  save = () => {
    const { editor } = this.props.blockProps;
    this.setState({ edit: false }, () => {
      editor.setState({ readOnly: false });
    });
    const key = this.props.block.getEntityAt(0);
    const { caption, src, content } = this.state;
    editor.replaceEntityData(key, {
      caption,
      src,
      content
    });
  }

  render() {
    const key = this.props.block.getEntityAt(0);
    const entity = Entity.get(key);
    const data = entity.getData();
    const type = entity.getType();

    if (type === 'HTML') {
      return (
        <div>
          { this.state.edit ? (
            <span>
              <HTMLEditor
                value={this.state.content}
                onChange={this.setField('content')}
                />
              <a href="" onClick={this.toggleEdit}>Done</a>
            </span>
          ) : (
            <span>
              <div dangerouslySetInnerHTML={{__html: this.state.content }} />
              <a href="" onClick={this.toggleEdit}>Edit</a>
            </span>
          ) }
        </div>

      )
    }

    return (
      <div className="relative">
        <a href="" className="absolute right--1 top--1" onClick={this.delete}>
          x
        </a>
        <Media {...this.props} />
        <figcaption>
          { this.state.edit ? (
            <span>
              <input
                type="text"
                defaultValue={this.state.src}
                onKeyPress={this.handleKeyPress}
                onChange={this.setInputField('src')}
                />
              <input
                type="text"
                defaultValue={this.state.caption}
                onKeyPress={this.handleKeyPress}
                onChange={this.setInputField('caption')}
                />
            </span>
          ) : (
            <span onClick={this.edit}>
              { this.state.caption || 'Подпись...'}
            </span>
          ) }
        </figcaption>
      </div>
    );
  }
}
